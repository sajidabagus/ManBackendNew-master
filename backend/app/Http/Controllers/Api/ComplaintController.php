<?php

namespace App\Http\Controllers\Api;

use App\Enums\ComplaintPriority;
use App\Enums\ComplaintStatus;
use App\Enums\ComplaintVisibility;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AssignComplaintRequest;
use App\Http\Requests\Api\StoreAdminComplaintMessageRequest;
use App\Http\Requests\Api\UpdateComplaintStatusRequest;
use App\Http\Resources\AdminComplaintResource;
use App\Models\Complaint;
use App\Services\ComplaintService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ComplaintController extends Controller
{
    public function __construct(
        private readonly ComplaintService $complaintService,
    ) {}

    public function dashboard(Request $request): JsonResponse
    {
        Gate::forUser($request->user())->authorize('viewAny', Complaint::class);

        return response()->json([
            'data' => $this->complaintService->dashboardStats(),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        Gate::forUser($request->user())->authorize('export', Complaint::class);

        $rows = $this->complaintService->exportRows($request->only(['status', 'category_id', 'from', 'to']));
        $this->complaintService->audit($request->user()->id, null, 'complaint.exported', [
            'count' => $rows->count(),
        ]);

        $filename = 'pengaduan-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ticket_number', 'title', 'category', 'status', 'priority', 'assignee', 'created_at']);
            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row->ticket_number,
                    $row->title,
                    $row->category?->name,
                    $row->status?->value,
                    $row->priority?->value,
                    $row->assignee?->name,
                    $row->created_at?->toDateTimeString(),
                ]);
            }
            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        Gate::forUser($request->user())->authorize('viewAny', Complaint::class);

        $items = $this->complaintService->paginateAdmin(
            $request->only(['search', 'status', 'category_id', 'assigned_to', 'priority', 'from', 'to']),
            (int) $request->query('per_page', 15),
        );

        return response()->json([
            'data' => AdminComplaintResource::collection($items),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $complaint = $this->complaintService->findAdmin($id);
        if (! $complaint) {
            return response()->json(['message' => 'Pengaduan tidak ditemukan.'], 404);
        }

        Gate::forUser($request->user())->authorize('view', $complaint);

        if (Gate::forUser($request->user())->allows('viewIdentity', $complaint)) {
            $this->complaintService->audit($request->user()->id, $complaint->id, 'complaint.identity_viewed', [
                'ticket_number' => $complaint->ticket_number,
            ]);
        }

        return response()->json([
            'data' => new AdminComplaintResource($complaint),
        ]);
    }

    public function updateStatus(UpdateComplaintStatusRequest $request, int $id): JsonResponse
    {
        $complaint = $this->complaintService->findAdmin($id);
        if (! $complaint) {
            return response()->json(['message' => 'Pengaduan tidak ditemukan.'], 404);
        }

        Gate::forUser($request->user())->authorize('update', $complaint);

        $complaint = $this->complaintService->updateStatus(
            $complaint,
            $request->user(),
            ComplaintStatus::from($request->validated('status')),
            $request->validated('public_note'),
            $request->validated('internal_note'),
        );

        return response()->json([
            'message' => 'Status pengaduan diperbarui.',
            'data' => new AdminComplaintResource($complaint),
        ]);
    }

    public function assign(AssignComplaintRequest $request, int $id): JsonResponse
    {
        $complaint = $this->complaintService->findAdmin($id);
        if (! $complaint) {
            return response()->json(['message' => 'Pengaduan tidak ditemukan.'], 404);
        }

        Gate::forUser($request->user())->authorize('assign', $complaint);

        $priority = $request->validated('priority');
        $complaint = $this->complaintService->assign(
            $complaint,
            $request->user(),
            $request->validated('assigned_to'),
            $priority ? ComplaintPriority::from($priority) : null,
        );

        return response()->json([
            'message' => 'Penugasan diperbarui.',
            'data' => new AdminComplaintResource($complaint),
        ]);
    }

    public function message(StoreAdminComplaintMessageRequest $request, int $id): JsonResponse
    {
        $complaint = $this->complaintService->findAdmin($id);
        if (! $complaint) {
            return response()->json(['message' => 'Pengaduan tidak ditemukan.'], 404);
        }

        Gate::forUser($request->user())->authorize('update', $complaint);

        $this->complaintService->addStaffMessage(
            $complaint,
            $request->user(),
            $request->validated('message'),
            ComplaintVisibility::from($request->validated('visibility')),
        );

        $fresh = $this->complaintService->findAdmin($id);

        return response()->json([
            'message' => 'Pesan berhasil ditambahkan.',
            'data' => new AdminComplaintResource($fresh),
        ]);
    }

    public function attachment(Request $request, int $id, int $attachmentId): BinaryFileResponse
    {
        $complaint = $this->complaintService->findAdmin($id);
        if (! $complaint) {
            abort(404, 'Pengaduan tidak ditemukan.');
        }

        Gate::forUser($request->user())->authorize('viewAttachments', $complaint);

        $attachment = $complaint->attachments->firstWhere('id', $attachmentId);
        if (! $attachment) {
            abort(404, 'Lampiran tidak ditemukan.');
        }

        $this->complaintService->audit($request->user()->id, $complaint->id, 'complaint.attachment_downloaded', [
            'attachment_id' => $attachment->id,
        ]);

        $path = $this->complaintService->downloadAttachment($attachment);

        return response()->download($path, $attachment->original_name);
    }
}
