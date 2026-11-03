<?php

namespace App\Http\Controllers\Api;

use App\Enums\ComplaintVisibility;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StorePublicComplaintMessageRequest;
use App\Http\Requests\Api\StorePublicComplaintRequest;
use App\Http\Requests\Api\TrackComplaintRequest;
use App\Http\Resources\ComplaintCategoryResource;
use App\Http\Resources\PublicComplaintResource;
use App\Services\ComplaintService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PublicComplaintController extends Controller
{
    public function __construct(
        private readonly ComplaintService $complaintService,
    ) {}

    public function categories(): JsonResponse
    {
        return response()->json([
            'data' => ComplaintCategoryResource::collection($this->complaintService->publicCategories()),
        ]);
    }

    public function store(StorePublicComplaintRequest $request): JsonResponse
    {
        $files = $request->file('attachments', []);
        if (! is_array($files)) {
            $files = $files ? [$files] : [];
        }

        $result = $this->complaintService->submitPublic($request->validated(), $files);
        $complaint = $result['complaint'];

        return response()->json([
            'message' => 'Pengaduan berhasil dikirim.',
            'data' => [
                'ticket_number' => $complaint->ticket_number,
                'access_code' => $result['access_code'],
                'created_at' => $complaint->created_at?->toIso8601String(),
                'title' => $complaint->title,
            ],
        ], 201);
    }

    public function track(TrackComplaintRequest $request): JsonResponse
    {
        $result = $this->complaintService->track(
            $request->validated('ticket_number'),
            $request->validated('access_code'),
        );

        return response()->json([
            'data' => [
                'tracking_token' => $result['tracking_token'],
                'expires_at' => $result['expires_at'],
                'complaint' => (new PublicComplaintResource($result['complaint']))->resolve(),
            ],
        ]);
    }

    public function status(Request $request, string $ticket): JsonResponse
    {
        $complaint = $this->complaintService->resolvePublicSession(
            $ticket,
            $this->sessionToken($request),
        );

        return response()->json([
            'data' => new PublicComplaintResource($complaint),
        ]);
    }

    public function message(StorePublicComplaintMessageRequest $request, string $ticket): JsonResponse
    {
        $complaint = $this->complaintService->resolvePublicSession(
            $ticket,
            $this->sessionToken($request),
        );

        $this->complaintService->addPublicMessage($complaint, $request->validated('message'));
        $fresh = $this->complaintService->resolvePublicSession($ticket, $this->sessionToken($request));

        return response()->json([
            'message' => 'Pesan berhasil dikirim.',
            'data' => new PublicComplaintResource($fresh),
        ]);
    }

    public function attachment(Request $request, string $ticket, int $attachmentId): BinaryFileResponse
    {
        $complaint = $this->complaintService->resolvePublicSession(
            $ticket,
            $this->sessionToken($request),
        );

        $attachment = $complaint->attachments
            ->firstWhere('id', $attachmentId);

        if (! $attachment || $attachment->visibility !== ComplaintVisibility::Public) {
            abort(404, 'Lampiran tidak ditemukan.');
        }

        $path = $this->complaintService->downloadAttachment($attachment);

        return response()->download($path, $attachment->original_name);
    }

    private function sessionToken(Request $request): ?string
    {
        $header = $request->header('X-Complaint-Session');
        if (is_string($header) && $header !== '') {
            return $header;
        }

        $bearer = $request->bearerToken();

        return is_string($bearer) && $bearer !== '' ? $bearer : null;
    }
}
