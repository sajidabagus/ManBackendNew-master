<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'gallery_id' => $this->gallery_id,
            'path' => $this->path,
            'url' => $this->url,
            'alt' => $this->alt,
            'sort_order' => $this->sort_order,
        ];
    }
}
