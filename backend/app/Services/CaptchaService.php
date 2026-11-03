<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CaptchaService
{
    private const CACHE_PREFIX = 'login_captcha:';

    private const TTL_MINUTES = 5;

    /** @return array{captcha_id: string, question: string} */
    public function generate(): array
    {
        $a = random_int(1, 15);
        $b = random_int(1, 15);
        $useAddition = random_int(0, 1) === 1;

        if (! $useAddition && $b > $a) {
            [$a, $b] = [$b, $a];
        }

        $answer = $useAddition ? $a + $b : $a - $b;
        $operator = $useAddition ? '+' : '-';
        $id = (string) Str::uuid();

        Cache::put(self::CACHE_PREFIX.$id, $answer, now()->addMinutes(self::TTL_MINUTES));

        return [
            'captcha_id' => $id,
            'question' => "{$a} {$operator} {$b} = ?",
        ];
    }

    public function validate(string $id, string $answer): bool
    {
        $key = self::CACHE_PREFIX.$id;
        $expected = Cache::get($key);

        if ($expected === null) {
            return false;
        }

        Cache::forget($key);

        return filter_var(trim($answer), FILTER_VALIDATE_INT) === (int) $expected;
    }
}
