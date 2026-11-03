<?php

namespace App\Http\Requests\Api;

use App\Enums\PublishStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'news_category_id' => ['nullable', 'exists:news_categories,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', Rule::enum(PublishStatus::class)],
            'published_at' => ['nullable', 'date'],
            'thumbnail' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
