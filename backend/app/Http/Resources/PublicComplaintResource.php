<?php

namespace App\Http\Resources;

use App\Enums\ComplaintStatus;
use App\Enums\ComplaintVisibility;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicComplaintResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'ticket_number' => $this->ticket_number,
            'title' => $this->title,
            'status' => $this->status?->value ?? $this->status,
            'status_label' => $this->status instanceof ComplaintStatus ? $this->status->label() : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'timeline' => $this->whenLoaded('statusHistories', function () {
                return $this->statusHistories
                    ->where('visibility', ComplaintVisibility::Public)
                    ->values()
                    ->map(fn ($item) => [
                        'status' => $item->new_status?->value,
                        'status_label' => $item->new_status?->label(),
                        'note' => $item->note,
                        'created_at' => $item->created_at?->toIso8601String(),
                    ]);
            }),
            'messages' => $this->whenLoaded('messages', function () {
                return $this->messages
                    ->where('visibility', ComplaintVisibility::Public)
                    ->values()
                    ->map(fn ($item) => [
                        'sender_type' => $item->sender_type?->value,
                        'message' => $item->message,
                        'created_at' => $item->created_at?->toIso8601String(),
                    ]);
            }),
            'attachments' => $this->whenLoaded('attachments', function () {
                return $this->attachments->map(fn ($file) => [
                    'id' => $file->id,
                    'original_name' => $file->original_name,
                    'mime_type' => $file->mime_type,
                    'file_size' => $file->file_size,
                ]);
            }),
            'needs_reporter_info' => $this->status === ComplaintStatus::WaitingReporter,
        ];
    }
}
