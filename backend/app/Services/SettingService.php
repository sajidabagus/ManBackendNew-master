<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class SettingService
{
    private const IMAGE_SETTINGS = [
        'school_logo' => 'general',
        'hero_image' => 'general',
        'org_chart_image' => 'general',
        'principal_photo' => 'profile',
        'integrity_image' => 'integrity',
    ];

    public function all(?string $group = null): Collection
    {
        $query = Setting::query()->orderBy('group')->orderBy('key');

        if ($group) {
            $query->where('group', $group);
        }

        return $query->get();
    }

    public function getGrouped(): array
    {
        return $this->all()
            ->groupBy('group')
            ->map(fn ($items) => $items->mapWithKeys(fn ($s) => [
                $s->key => $this->resolvePublicValue($s),
            ]))
            ->toArray();
    }

    public function updateBulk(array $settings): void
    {
        foreach ($settings as $key => $value) {
            if (array_key_exists($key, self::IMAGE_SETTINGS)) {
                continue;
            }

            $meta = $this->settingDefaults()[$key] ?? null;

            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => is_array($value) ? json_encode($value) : (string) $value,
                    'group' => $meta['group'] ?? Setting::query()->where('key', $key)->value('group'),
                    'type' => $meta['type'] ?? 'string',
                ]
            );
        }
    }

    public function updateLogo(UploadedFile $image): string
    {
        return $this->updateImage('school_logo', $image);
    }

    public function deleteLogo(): void
    {
        $this->deleteImage('school_logo');
    }

    public function updateHeroImage(UploadedFile $image): string
    {
        return $this->updateImage('hero_image', $image);
    }

    public function deleteHeroImage(): void
    {
        $this->deleteImage('hero_image');
    }

    public function updateOrgChartImage(UploadedFile $image): string
    {
        return $this->updateImage('org_chart_image', $image);
    }

    public function deleteOrgChartImage(): void
    {
        $this->deleteImage('org_chart_image');
    }

    public function updatePrincipalPhoto(UploadedFile $image): string
    {
        return $this->updateImage('principal_photo', $image);
    }

    public function deletePrincipalPhoto(): void
    {
        $this->deleteImage('principal_photo');
    }

    public function updateIntegrityImage(UploadedFile $image): string
    {
        return $this->updateImage('integrity_image', $image);
    }

    public function deleteIntegrityImage(): void
    {
        $this->deleteImage('integrity_image');
    }

    private function updateImage(string $key, UploadedFile $image): string
    {
        $existing = Setting::query()->where('key', $key)->first();

        if ($existing?->value) {
            Storage::disk('public')->delete($existing->value);
        }

        $path = $image->store('settings', 'public');

        Setting::updateOrCreate(
            ['key' => $key],
            [
                'value' => $path,
                'group' => self::IMAGE_SETTINGS[$key],
                'type' => 'image',
            ]
        );

        return Storage::disk('public')->url($path);
    }

    private function deleteImage(string $key): void
    {
        $existing = Setting::query()->where('key', $key)->first();

        if (! $existing?->value) {
            return;
        }

        Storage::disk('public')->delete($existing->value);
        $existing->delete();
    }

    public function resolvePublicValue(Setting $setting): ?string
    {
        if (array_key_exists($setting->key, self::IMAGE_SETTINGS) && $setting->value) {
            return Storage::disk('public')->url($setting->value);
        }

        return $setting->value;
    }

    public function seedDefaults(): void
    {
        foreach ($this->settingDefaults() as $key => $meta) {
            Setting::firstOrCreate(
                ['key' => $key],
                [
                    'value' => $meta['value'],
                    'group' => $meta['group'],
                    'type' => $meta['type'] ?? 'string',
                ]
            );
        }
    }

    /**
     * @return array<string, array{value: mixed, group: string, type?: string}>
     */
    private function settingDefaults(): array
    {
        return [
            'school_name' => ['value' => 'MAN 2 Kota Madiun', 'group' => 'general'],
            'school_tagline' => ['value' => 'Madrasah Digital Modern Berprestasi', 'group' => 'general'],
            'school_logo' => ['value' => null, 'group' => 'general', 'type' => 'image'],
            'hero_image' => ['value' => null, 'group' => 'general', 'type' => 'image'],
            'org_chart_image' => ['value' => null, 'group' => 'general', 'type' => 'image'],
            'org_chart_title' => ['value' => 'Struktur Organisasi', 'group' => 'general'],
            'school_address' => ['value' => 'Jl. Raya Taman No. 1, Taman, Madiun, Jawa Timur 63131', 'group' => 'general'],
            'school_phone' => ['value' => '(0351) 1234567', 'group' => 'general'],
            'school_email' => ['value' => 'info@man2madiun.sch.id', 'group' => 'general'],
            'school_hours' => ['value' => 'Senin – Jumat: 07.00 – 15.30 WIB', 'group' => 'general'],
            'principal_name' => ['value' => 'Dr. H. Ahmad Fauzi, M.Pd.', 'group' => 'profile'],
            'principal_title' => ['value' => 'Kepala Madrasah', 'group' => 'profile'],
            'principal_photo' => ['value' => null, 'group' => 'profile', 'type' => 'image'],
            'principal_greeting' => ['value' => 'Assalamu\'alaikum warahmatullahi wabarakatuh.', 'group' => 'profile'],
            'school_vision' => ['value' => 'Menjadi madrasah unggul berwawasan digital.', 'group' => 'profile'],
            'total_students' => ['value' => '1248', 'group' => 'stats'],
            'total_teachers' => ['value' => '86', 'group' => 'stats'],
            'total_prestasi' => ['value' => '320', 'group' => 'stats'],
            'total_ruang' => ['value' => '36', 'group' => 'stats'],
            'school_mission' => [
                'value' => "Menyelenggarakan pendidikan berkualitas berbasis teknologi\nMengembangkan karakter Islami dan kepemimpinan siswa\nMembangun ekosistem layanan digital terintegrasi\nMenjalin kemitraan strategis dengan dunia industri dan perguruan tinggi",
                'group' => 'profile',
            ],
            'school_accreditation' => ['value' => 'Terakreditasi A (BAN-S/M)', 'group' => 'profile'],
            'instagram_url' => ['value' => 'https://instagram.com', 'group' => 'social'],
            'youtube_url' => ['value' => 'https://youtube.com', 'group' => 'social'],
            'facebook_url' => ['value' => 'https://facebook.com', 'group' => 'social'],
            'tiktok_url' => ['value' => 'https://tiktok.com', 'group' => 'social'],
            'achievements_badge' => ['value' => 'Prestasi', 'group' => 'achievements'],
            'achievements_title' => ['value' => 'Prestasi Sekolah', 'group' => 'achievements'],
            'achievements_subtitle' => [
                'value' => 'Kebanggaan MAN 2 Madiun di tingkat kota, provinsi, hingga nasional.',
                'group' => 'achievements',
            ],
            'achievements_counter_1_value' => ['value' => '48', 'group' => 'achievements'],
            'achievements_counter_1_label' => ['value' => 'Prestasi Nasional', 'group' => 'achievements'],
            'achievements_counter_2_value' => ['value' => '112', 'group' => 'achievements'],
            'achievements_counter_2_label' => ['value' => 'Prestasi Provinsi', 'group' => 'achievements'],
            'achievements_counter_3_value' => ['value' => '160', 'group' => 'achievements'],
            'achievements_counter_3_label' => ['value' => 'Prestasi Kota', 'group' => 'achievements'],
            'integrity_badge' => ['value' => 'Zona Integritas', 'group' => 'integrity'],
            'integrity_title' => ['value' => 'Zona Integritas MAN 2 Kota Madiun', 'group' => 'integrity'],
            'integrity_subtitle' => [
                'value' => 'Komitmen kami mewujudkan layanan pendidikan yang bersih, transparan, dan bebas dari korupsi.',
                'group' => 'integrity',
            ],
            'integrity_description' => [
                'value' => 'MAN 2 Kota Madiun berkomitmen menerapkan Zona Integritas (ZI) sebagai upaya mencegah dan memberantas korupsi, kolusi, dan nepotisme (KKN) di lingkungan madrasah.',
                'group' => 'integrity',
            ],
            'integrity_commitments' => [
                'value' => "Menolak gratifikasi dan pemberian terkait jabatan\nTidak menerima hadiah terkait tugas dan jabatan\nMenjaga kerahasiaan dokumen dan data madrasah\nTidak mempergunakan fasilitas kantor untuk kepentingan pribadi\nMenjaga integritas dalam proses pelayanan publik\nMelaporkan dugaan pelanggaran integritas kepada pihak berwenang",
                'group' => 'integrity',
            ],
            'integrity_contact_label' => ['value' => 'Lapor Pelanggaran Integritas', 'group' => 'integrity'],
            'integrity_contact_email' => ['value' => 'zi@man2madiun.sch.id', 'group' => 'integrity'],
            'integrity_contact_phone' => ['value' => '(0351) 1234567', 'group' => 'integrity'],
            'integrity_image' => ['value' => null, 'group' => 'integrity', 'type' => 'image'],
            'faq_badge' => ['value' => 'FAQ', 'group' => 'faq'],
            'faq_title' => ['value' => 'Pertanyaan yang Sering Diajukan', 'group' => 'faq'],
            'faq_subtitle' => [
                'value' => 'Jawaban untuk pertanyaan umum seputar pendaftaran, kegiatan belajar, dan layanan madrasah.',
                'group' => 'faq',
            ],
            'testimonials_badge' => ['value' => 'Testimoni Alumni', 'group' => 'testimonials'],
            'testimonials_title' => ['value' => 'Suara Alumni MAN 2 Madiun', 'group' => 'testimonials'],
            'testimonials_subtitle' => [
                'value' => 'Cerita inspiratif dari alumni yang telah melanjutkan perjalanan di berbagai bidang.',
                'group' => 'testimonials',
            ],
        ];
    }
}
