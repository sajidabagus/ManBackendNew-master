<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'is_sensitive' => $this->when($request->user() !== null, $this->is_sensitive),
            'default_priority' => $this->when($request->user() !== null, $this->default_priority?->value ?? $this->default_priority),
            'sort_order' => $this->when($request->user() !== null, $this->sort_order),
        ];
    }
}
