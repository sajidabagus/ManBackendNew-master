<?php

namespace App\Http\Resources;

use App\Enums\ComplaintStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class AdminComplaintResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $includeIdentity = Gate::forUser($request->user())->allows('viewIdentity', $this->resource);
        $includeAttachments = Gate::forUser($request->user())->allows('viewAttachments', $this->resource);
        $isList = ! $this->relationLoaded('messages');

        return [
            'id' => $this->id,
            'ticket_number' => $this->ticket_number,
            'title' => $this->title,
            'description' => $this->when(! $isList, $this->description),
            'reporter_type' => $this->reporter_type?->value,
            'identity_mode' => $this->identity_mode?->value,
            'status' => $this->status?->value,
            'status_label' => $this->status instanceof ComplaintStatus ? $this->status->label() : null,
            'allowed_transitions' => $this->when(
                ! $isList && $this->status instanceof ComplaintStatus,
                fn () => array_map(fn ($s) => $s->value, $this->status->allowedTransitions())
            ),
            'priority' => $this->priority?->value,
            'incident_at' => $this->incident_at?->toIso8601String(),
            'location' => $this->when(! $isList, $this->location),
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
                'is_sensitive' => $this->category->is_sensitive,
            ]),
            'assignee' => $this->whenLoaded('assignee', fn () => $this->assignee ? [
                'id' => $this->assignee->id,
                'name' => $this->assignee->name,
                'email' => $this->assignee->email,
            ] : null),
            'identity' => $this->when($includeIdentity && $this->relationLoaded('identity'), function () {
                if (! $this->identity) {
                    return null;
                }

                return [
                    'name' => $this->identity->name,
                    'email' => $this->identity->email,
                    'phone' => $this->identity->phone,
                    'contact_preference' => $this->identity->contact_preference,
                ];
            }),
            'identity_restricted' => $this->when(
                $this->relationLoaded('identity') && ! $includeIdentity,
                true
            ),
            'attachments' => $this->when($includeAttachments && $this->relationLoaded('attachments'), function () {
                return $this->attachments->map(fn ($file) => [
                    'id' => $file->id,
                    'original_name' => $file->original_name,
                    'mime_type' => $file->mime_type,
                    'file_size' => $file->file_size,
                    'visibility' => $file->visibility?->value,
                    'created_at' => $file->created_at?->toIso8601String(),
                ]);
            }),
            'messages' => $this->whenLoaded('messages', function () {
                return $this->messages->map(fn ($item) => [
                    'id' => $item->id,
                    'sender_type' => $item->sender_type?->value,
                    'sender_name' => $item->sender?->name,
                    'message' => $item->message,
                    'visibility' => $item->visibility?->value,
                    'created_at' => $item->created_at?->toIso8601String(),
                ]);
            }),
            'status_histories' => $this->whenLoaded('statusHistories', function () {
                return $this->statusHistories->map(fn ($item) => [
                    'old_status' => $item->old_status?->value,
                    'new_status' => $item->new_status?->value,
                    'note' => $item->note,
                    'visibility' => $item->visibility?->value,
                    'changed_by' => $item->changer?->name,
                    'created_at' => $item->created_at?->toIso8601String(),
                ]);
            }),
            'audit_logs' => $this->whenLoaded('auditLogs', function () {
                return $this->auditLogs->map(fn ($item) => [
                    'action' => $item->action,
                    'actor' => $item->actor?->name,
                    'metadata' => $item->metadata,
                    'created_at' => $item->created_at?->toIso8601String(),
                ]);
            }),
        ];
    }
}
