<?php

namespace App\Http\Requests\Api;

use App\Enums\IdentityMode;
use App\Enums\ReporterType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePublicComplaintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $identified = $this->input('identity_mode') === IdentityMode::Identified->value;
        $maxKb = (int) config('complaints.max_attachment_kb', 5120);
        $maxFiles = (int) config('complaints.max_attachments', 3);

        return [
            'category_id' => ['required', 'integer', Rule::exists('complaint_categories', 'id')->where('is_active', true)],
            'reporter_type' => ['required', Rule::enum(ReporterType::class)],
            'identity_mode' => ['required', Rule::enum(IdentityMode::class)],
            'name' => [$identified ? 'required' : 'nullable', 'string', 'max:150'],
            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:20'],
            'contact_preference' => ['nullable', Rule::in(['email', 'whatsapp', 'none'])],
            'title' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string', 'min:20', 'max:8000'],
            'incident_at' => ['nullable', 'date', 'before_or_equal:now'],
            'location' => ['nullable', 'string', 'max:255'],
            'privacy_accepted' => ['accepted'],
            'attachments' => ['nullable', 'array', 'max:'.$maxFiles],
            'attachments.*' => ['file', 'max:'.$maxKb, 'mimes:jpg,jpeg,png,webp,pdf'],
        ];
    }

    public function messages(): array
    {
        return [
            'privacy_accepted.accepted' => 'Anda harus menyetujui pemberitahuan privasi sebelum mengirim laporan.',
            'description.min' => 'Kronologi pengaduan minimal 20 karakter.',
            'name.required' => 'Nama pelapor wajib diisi jika tidak memilih mode anonim.',
        ];
    }
}
