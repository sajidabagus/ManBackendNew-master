<?php

namespace App\Services;

use App\Enums\ComplaintMessageSender;
use App\Enums\ComplaintPriority;
use App\Enums\ComplaintStatus;
use App\Enums\ComplaintVisibility;
use App\Enums\IdentityMode;
use App\Models\Complaint;
use App\Models\ComplaintAttachment;
use App\Models\ComplaintAuditLog;
use App\Models\ComplaintCategory;
use App\Models\ComplaintMessage;
use App\Models\ComplaintTrackingToken;
use App\Models\User;
use App\Support\SlugGenerator;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ComplaintService
{
    public function publicCategories(): Collection
    {
        return ComplaintCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    /**
     * @param  array<int, UploadedFile>  $files
     * @return array{complaint: Complaint, access_code: string}
     */
    public function submitPublic(array $data, array $files = []): array
    {
        $this->assertValidAttachments($files);

        $category = ComplaintCategory::query()
            ->where('id', $data['category_id'])
            ->where('is_active', true)
            ->firstOrFail();

        $attempts = 0;

        while ($attempts < 5) {
            $attempts++;

            try {
                return DB::transaction(function () use ($data, $files, $category) {
                    $complaint = Complaint::query()->create([
                        'ticket_number' => $this->nextTicketNumber(),
                        'category_id' => $category->id,
                        'reporter_type' => $data['reporter_type'],
                        'identity_mode' => $data['identity_mode'],
                        'title' => $this->sanitizeText($data['title']),
                        'description' => $this->sanitizeText($data['description']),
                        'incident_at' => $data['incident_at'] ?? null,
                        'location' => isset($data['location']) ? $this->sanitizeText($data['location']) : null,
                        'status' => ComplaintStatus::Submitted,
                        'priority' => $category->default_priority,
                    ]);

                    $this->storeIdentityIfNeeded($complaint, $data);
                    $this->storeAttachments($complaint, $files, null, ComplaintVisibility::Public);

                    $plainAccess = $this->generateAccessCode();
                    $complaint->trackingTokens()->create([
                        'type' => ComplaintTrackingToken::TYPE_ACCESS,
                        'token_hash' => Hash::make($plainAccess),
                    ]);

                    $complaint->statusHistories()->create([
                        'old_status' => null,
                        'new_status' => ComplaintStatus::Submitted,
                        'note' => 'Laporan diterima sistem.',
                        'visibility' => ComplaintVisibility::Public,
                    ]);

                    $this->audit(null, $complaint->id, 'complaint.submitted', [
                        'ticket_number' => $complaint->ticket_number,
                        'identity_mode' => $complaint->identity_mode->value,
                        'category_id' => $complaint->category_id,
                    ]);

                    return [
                        'complaint' => $complaint->load('category'),
                        'access_code' => $plainAccess,
                    ];
                });
            } catch (QueryException $e) {
                if (! $this->isUniqueTicketConflict($e) || $attempts >= 5) {
                    throw $e;
                }
            }
        }

        throw ValidationException::withMessages([
            'title' => ['Gagal membuat nomor tiket. Silakan coba lagi.'],
        ]);
    }

    /**
     * @return array{complaint: Complaint, tracking_token: string, expires_at: string}
     */
    public function track(string $ticketNumber, string $accessCode): array
    {
        $complaint = Complaint::query()
            ->where('ticket_number', $ticketNumber)
            ->first();

        $accessToken = $complaint?->trackingTokens()
            ->where('type', ComplaintTrackingToken::TYPE_ACCESS)
            ->whereNull('revoked_at')
            ->first();

        $hash = $accessToken?->token_hash ?? (string) config('complaints.dummy_password_hash');
        $valid = Hash::check($accessCode, $hash) && $complaint && $accessToken?->isUsable();

        if (! $valid) {
            throw ValidationException::withMessages([
                'ticket_number' => ['Nomor tiket atau kode akses tidak valid.'],
            ]);
        }

        $plainSession = $this->generateSessionToken();
        $minutes = (int) config('complaints.session_ttl_minutes', 120);
        $expiresAt = now()->addMinutes($minutes);

        $accessToken->forceFill(['last_used_at' => now()])->save();

        $complaint->trackingTokens()->create([
            'type' => ComplaintTrackingToken::TYPE_SESSION,
            'token_hash' => hash('sha256', $plainSession),
            'expires_at' => $expiresAt,
        ]);

        $this->audit(null, $complaint->id, 'complaint.tracked', [
            'ticket_number' => $complaint->ticket_number,
        ]);

        return [
            'complaint' => $this->loadPublicRelations($complaint),
            'tracking_token' => $plainSession,
            'expires_at' => $expiresAt->toIso8601String(),
        ];
    }

    public function resolvePublicSession(string $ticketNumber, ?string $sessionToken): Complaint
    {
        if (! $sessionToken) {
            throw new HttpException(401, 'Sesi pelacakan tidak valid.');
        }

        $complaint = Complaint::query()
            ->where('ticket_number', $ticketNumber)
            ->first();

        if (! $complaint) {
            throw new HttpException(401, 'Sesi pelacakan tidak valid.');
        }

        $hash = hash('sha256', $sessionToken);
        $session = $complaint->trackingTokens()
            ->where('type', ComplaintTrackingToken::TYPE_SESSION)
            ->where('token_hash', $hash)
            ->first();

        if (! $session || ! $session->isUsable()) {
            throw new HttpException(401, 'Sesi pelacakan tidak valid.');
        }

        $session->forceFill(['last_used_at' => now()])->save();

        return $this->loadPublicRelations($complaint);
    }

    public function addPublicMessage(Complaint $complaint, string $message): ComplaintMessage
    {
        return DB::transaction(function () use ($complaint, $message) {
            $created = $complaint->messages()->create([
                'sender_id' => null,
                'sender_type' => ComplaintMessageSender::Reporter,
                'message' => $this->sanitizeText($message),
                'visibility' => ComplaintVisibility::Public,
            ]);

            if ($complaint->status === ComplaintStatus::WaitingReporter) {
                $this->changeStatus(
                    $complaint,
                    ComplaintStatus::InProgress,
                    null,
                    'Pelapor mengirim informasi tambahan.',
                    null,
                );
            }

            $this->audit(null, $complaint->id, 'complaint.public_message', [
                'ticket_number' => $complaint->ticket_number,
            ]);

            return $created;
        });
    }

    public function paginateAdmin(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = Complaint::query()
            ->with(['category:id,name,slug,is_sensitive', 'assignee:id,name,email'])
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('ticket_number', 'like', '%'.$search.'%')
                        ->orWhere('title', 'like', '%'.$search.'%');
                });
            })
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($filters['category_id'] ?? null, fn ($q, $id) => $q->where('category_id', $id))
            ->when($filters['assigned_to'] ?? null, fn ($q, $id) => $q->where('assigned_to', $id))
            ->when($filters['priority'] ?? null, fn ($q, $priority) => $q->where('priority', $priority))
            ->when($filters['from'] ?? null, fn ($q, $from) => $q->whereDate('created_at', '>=', $from))
            ->when($filters['to'] ?? null, fn ($q, $to) => $q->whereDate('created_at', '<=', $to))
            ->latest();

        return $query->paginate($perPage);
    }

    public function findAdmin(int $id): ?Complaint
    {
        return Complaint::query()
            ->with([
                'category',
                'assignee:id,name,email',
                'identity',
                'attachments',
                'messages.sender:id,name',
                'statusHistories.changer:id,name',
                'auditLogs.actor:id,name',
            ])
            ->find($id);
    }

    public function updateStatus(
        Complaint $complaint,
        User $actor,
        ComplaintStatus $status,
        ?string $publicNote,
        ?string $internalNote,
    ): Complaint {
        if (! $complaint->status->canTransitionTo($status)) {
            throw ValidationException::withMessages([
                'status' => ['Perubahan status tidak diizinkan dari status saat ini.'],
            ]);
        }

        return DB::transaction(function () use ($complaint, $actor, $status, $publicNote, $internalNote) {
            $this->changeStatus($complaint, $status, $actor, $publicNote, $internalNote);

            if ($publicNote) {
                $complaint->messages()->create([
                    'sender_id' => $actor->id,
                    'sender_type' => ComplaintMessageSender::Staff,
                    'message' => $this->sanitizeText($publicNote),
                    'visibility' => ComplaintVisibility::Public,
                ]);
            }

            return $this->findAdmin($complaint->id) ?? $complaint->fresh();
        });
    }

    public function assign(Complaint $complaint, User $actor, ?int $assignedTo, ?ComplaintPriority $priority): Complaint
    {
        return DB::transaction(function () use ($complaint, $actor, $assignedTo, $priority) {
            $data = ['assigned_to' => $assignedTo];
            if ($priority) {
                $data['priority'] = $priority;
            }

            $complaint->update($data);

            if ($assignedTo && $complaint->status === ComplaintStatus::Submitted) {
                $this->changeStatus($complaint, ComplaintStatus::Assigned, $actor, 'Laporan ditugaskan kepada petugas.', null);
            } elseif ($assignedTo && $complaint->status === ComplaintStatus::UnderReview) {
                $this->changeStatus($complaint, ComplaintStatus::Assigned, $actor, 'Laporan ditugaskan kepada petugas.', null);
            }

            $this->audit($actor->id, $complaint->id, 'complaint.assigned', [
                'assigned_to' => $assignedTo,
                'priority' => ($priority ?? $complaint->priority)->value,
            ]);

            return $this->findAdmin($complaint->id) ?? $complaint->fresh();
        });
    }

    public function addStaffMessage(Complaint $complaint, User $actor, string $message, ComplaintVisibility $visibility): ComplaintMessage
    {
        $created = $complaint->messages()->create([
            'sender_id' => $actor->id,
            'sender_type' => ComplaintMessageSender::Staff,
            'message' => $this->sanitizeText($message),
            'visibility' => $visibility,
        ]);

        $this->audit($actor->id, $complaint->id, 'complaint.staff_message', [
            'visibility' => $visibility->value,
        ]);

        if ($visibility === ComplaintVisibility::Public && $complaint->status === ComplaintStatus::InProgress) {
            // keep current status; public reply does not force waiting
        }

        return $created;
    }

    public function dashboardStats(): array
    {
        $base = Complaint::query();

        $byStatus = Complaint::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $byCategory = Complaint::query()
            ->join('complaint_categories', 'complaint_categories.id', '=', 'complaints.category_id')
            ->selectRaw('complaint_categories.name as name, COUNT(*) as total')
            ->groupBy('complaint_categories.id', 'complaint_categories.name')
            ->orderByDesc('total')
            ->get();

        $trend = Complaint::query()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $openStatuses = [
            ComplaintStatus::Submitted->value,
            ComplaintStatus::UnderReview->value,
            ComplaintStatus::Assigned->value,
            ComplaintStatus::InProgress->value,
            ComplaintStatus::WaitingReporter->value,
        ];

        return [
            'total' => (clone $base)->count(),
            'new' => (clone $base)->where('status', ComplaintStatus::Submitted)->count(),
            'in_progress' => (clone $base)->whereIn('status', $openStatuses)->count(),
            'resolved' => (clone $base)->whereIn('status', [
                ComplaintStatus::Resolved->value,
                ComplaintStatus::Closed->value,
            ])->count(),
            'high_priority' => (clone $base)->whereIn('priority', [
                ComplaintPriority::High->value,
                ComplaintPriority::Urgent->value,
            ])->count(),
            'by_status' => $byStatus,
            'by_category' => $byCategory,
            'trend' => $trend,
        ];
    }

    public function exportRows(array $filters): Collection
    {
        return Complaint::query()
            ->with(['category:id,name', 'assignee:id,name'])
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($filters['category_id'] ?? null, fn ($q, $id) => $q->where('category_id', $id))
            ->when($filters['from'] ?? null, fn ($q, $from) => $q->whereDate('created_at', '>=', $from))
            ->when($filters['to'] ?? null, fn ($q, $to) => $q->whereDate('created_at', '<=', $to))
            ->latest()
            ->limit(2000)
            ->get();
    }

    public function paginateCategories(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        return ComplaintCategory::query()
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where('name', 'like', '%'.$search.'%');
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function createCategory(array $data): ComplaintCategory
    {
        $data['slug'] = $data['slug'] ?? SlugGenerator::unique($data['name'], new ComplaintCategory);

        return ComplaintCategory::query()->create($data);
    }

    public function updateCategory(ComplaintCategory $category, array $data): ComplaintCategory
    {
        if (! empty($data['name']) && empty($data['slug']) && $data['name'] !== $category->name) {
            $data['slug'] = SlugGenerator::unique($data['name'], new ComplaintCategory, 'slug', $category->id);
        }

        $category->update($data);

        return $category->fresh();
    }

    public function deleteCategory(ComplaintCategory $category): void
    {
        if ($category->complaints()->exists()) {
            throw ValidationException::withMessages([
                'category' => ['Kategori tidak dapat dihapus karena masih digunakan laporan.'],
            ]);
        }

        $category->delete();
    }

    public function downloadAttachment(ComplaintAttachment $attachment): string
    {
        $disk = Storage::disk((string) config('complaints.storage_disk', 'local'));
        if (! $disk->exists($attachment->storage_path)) {
            throw new NotFoundHttpException('Lampiran tidak ditemukan.');
        }

        return $disk->path($attachment->storage_path);
    }

    public function audit(?int $actorId, ?int $complaintId, string $action, array $metadata = []): void
    {
        ComplaintAuditLog::query()->create([
            'actor_id' => $actorId,
            'complaint_id' => $complaintId,
            'action' => $action,
            'metadata' => $metadata,
        ]);
    }

    private function changeStatus(
        Complaint $complaint,
        ComplaintStatus $status,
        ?User $actor,
        ?string $publicNote,
        ?string $internalNote,
    ): void {
        $old = $complaint->status;
        $resolvedAt = in_array($status, [ComplaintStatus::Resolved, ComplaintStatus::Closed], true)
            ? now()
            : $complaint->resolved_at;

        $complaint->update([
            'status' => $status,
            'resolved_at' => $resolvedAt,
        ]);

        if ($publicNote) {
            $complaint->statusHistories()->create([
                'old_status' => $old,
                'new_status' => $status,
                'changed_by' => $actor?->id,
                'note' => $this->sanitizeText($publicNote),
                'visibility' => ComplaintVisibility::Public,
            ]);
        }

        $complaint->statusHistories()->create([
            'old_status' => $old,
            'new_status' => $status,
            'changed_by' => $actor?->id,
            'note' => $internalNote ? $this->sanitizeText($internalNote) : null,
            'visibility' => ComplaintVisibility::Internal,
        ]);

        $this->audit($actor?->id, $complaint->id, 'complaint.status_changed', [
            'from' => $old->value,
            'to' => $status->value,
        ]);
    }

    private function storeIdentityIfNeeded(Complaint $complaint, array $data): void
    {
        $hasContact = filled($data['name'] ?? null) || filled($data['email'] ?? null) || filled($data['phone'] ?? null);
        if (! $hasContact) {
            return;
        }

        $anonymous = ($data['identity_mode'] ?? null) === IdentityMode::Anonymous->value;

        $complaint->identity()->create([
            'name' => $anonymous ? null : ($data['name'] ?? null),
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'contact_preference' => $data['contact_preference'] ?? null,
        ]);
    }

    /**
     * @param  array<int, UploadedFile>  $files
     */
    private function storeAttachments(
        Complaint $complaint,
        array $files,
        ?int $uploaderId,
        ComplaintVisibility $visibility,
    ): void {
        $disk = (string) config('complaints.storage_disk', 'local');
        $directory = trim((string) config('complaints.storage_directory', 'complaints'), '/').'/'.$complaint->id;

        foreach ($files as $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension());
            $storedName = Str::uuid()->toString().'.'.$extension;
            $path = $file->storeAs($directory, $storedName, $disk);

            $complaint->attachments()->create([
                'uploaded_by' => $uploaderId,
                'original_name' => $file->getClientOriginalName(),
                'storage_path' => $path,
                'mime_type' => $file->getMimeType() ?: 'application/octet-stream',
                'file_size' => $file->getSize(),
                'visibility' => $visibility,
            ]);
        }
    }

    /**
     * @param  array<int, UploadedFile>  $files
     */
    private function assertValidAttachments(array $files): void
    {
        $allowedMimes = config('complaints.allowed_mimes', []);
        $allowedExt = config('complaints.allowed_extensions', []);

        foreach ($files as $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $mime = $file->getMimeType();
            $ext = strtolower($file->getClientOriginalExtension() ?: '');

            if (! in_array($mime, $allowedMimes, true) || ! in_array($ext, $allowedExt, true)) {
                throw ValidationException::withMessages([
                    'attachments' => ['Jenis berkas tidak diizinkan. Gunakan JPG, PNG, WEBP, atau PDF.'],
                ]);
            }
        }
    }

    private function nextTicketNumber(): string
    {
        $year = now()->year;
        $prefix = config('complaints.ticket_prefix', 'ADU').'-'.$year.'-';

        $last = Complaint::query()
            ->where('ticket_number', 'like', $prefix.'%')
            ->orderByDesc('ticket_number')
            ->lockForUpdate()
            ->value('ticket_number');

        $seq = 1;
        if (is_string($last) && preg_match('/(\d{6})$/', $last, $matches)) {
            $seq = ((int) $matches[1]) + 1;
        }

        return $prefix.str_pad((string) $seq, 6, '0', STR_PAD_LEFT);
    }

    private function generateAccessCode(): string
    {
        $bytes = (int) config('complaints.access_code_bytes', 16);
        $hex = bin2hex(random_bytes($bytes));

        return strtoupper(implode('-', str_split($hex, 8)));
    }

    private function generateSessionToken(): string
    {
        return bin2hex(random_bytes(32));
    }

    private function sanitizeText(string $value): string
    {
        return trim(strip_tags($value));
    }

    private function isUniqueTicketConflict(QueryException $e): bool
    {
        $sqlState = $e->errorInfo[0] ?? null;

        return $sqlState === '23000' || str_contains(strtolower($e->getMessage()), 'unique');
    }

    private function loadPublicRelations(Complaint $complaint): Complaint
    {
        return $complaint->load([
            'category:id,name,slug',
            'attachments' => fn ($q) => $q->where('visibility', ComplaintVisibility::Public),
            'messages' => fn ($q) => $q->where('visibility', ComplaintVisibility::Public)->orderBy('created_at'),
            'statusHistories' => fn ($q) => $q->where('visibility', ComplaintVisibility::Public)->orderBy('created_at'),
        ]);
    }
}
