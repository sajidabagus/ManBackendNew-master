<?php

namespace App\Http\Requests\Api;

use App\Services\CaptchaService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'captcha_id' => ['required', 'uuid'],
            'captcha_answer' => ['required', 'string', 'max:10'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $valid = app(CaptchaService::class)->validate(
                $this->validated('captcha_id'),
                $this->validated('captcha_answer'),
            );

            if (! $valid) {
                $validator->errors()->add(
                    'captcha_answer',
                    'Captcha salah atau sudah kedaluwarsa. Muat ulang captcha.',
                );
            }
        });
    }
}
