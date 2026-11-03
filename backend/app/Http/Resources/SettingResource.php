<?php

namespace App\Http\Resources;

use App\Services\SettingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'key' => $this->key,
            'value' => $this->value,
            'group' => $this->group,
            'type' => $this->type,
        ];

        if ($this->type === 'image' && $this->value) {
            $data['url'] = app(SettingService::class)->resolvePublicValue($this->resource);
        }

        return $data;
    }
}
