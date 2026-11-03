<?php

namespace App\Http\Requests\Api;

use App\Enums\ComplaintPriority;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreComplaintCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:160', 'unique:complaint_categories,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'is_sensitive' => ['boolean'],
            'default_priority' => ['required', Rule::enum(ComplaintPriority::class)],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
