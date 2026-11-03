<?php

namespace App\Http\Requests\Api;

use App\Enums\ComplaintVisibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdminComplaintMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'min:3', 'max:4000'],
            'visibility' => ['required', Rule::enum(ComplaintVisibility::class)],
        ];
    }
}
