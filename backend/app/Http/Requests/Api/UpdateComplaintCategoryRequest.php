<?php

namespace App\Http\Requests\Api;

use App\Enums\ComplaintPriority;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateComplaintCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'slug' => ['sometimes', 'required', 'string', 'max:160', Rule::unique('complaint_categories', 'slug')->ignore($id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'is_sensitive' => ['boolean'],
            'default_priority' => ['sometimes', 'required', Rule::enum(ComplaintPriority::class)],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
