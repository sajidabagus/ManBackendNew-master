<?php

namespace App\Http\Requests\Api;

use App\Enums\ComplaintStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateComplaintStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(ComplaintStatus::class)],
            'public_note' => ['nullable', 'string', 'max:4000'],
            'internal_note' => ['nullable', 'string', 'max:4000'],
        ];
    }
}
