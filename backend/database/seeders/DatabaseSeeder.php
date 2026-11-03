<?php

namespace Database\Seeders;

use App\Enums\PublishStatus;
use App\Models\Achievement;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\Service;
use App\Models\User;
use App\Models\VisitorStat;
use App\Services\SettingService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);
        $this->call(ComplaintCategorySeeder::class);

        $admin = User::firstOrCreate(
            ['email' => 'admin@man2madiun.sch.id'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );
        $admin->assignRole('superadmin');

        $categories = [
            ['name' => 'Prestasi', 'slug' => 'prestasi'],
            ['name' => 'Teknologi', 'slug' => 'teknologi'],
            ['name' => 'Kegiatan', 'slug' => 'kegiatan'],
        ];

        foreach ($categories as $cat) {
            NewsCategory::firstOrCreate(['slug' => $cat['slug']], $cat + ['is_active' => true]);
        }

        $category = NewsCategory::first();

        News::firstOrCreate(
            ['slug' => 'man-2-madiun-juara-osn-provinsi'],
            [
                'news_category_id' => $category?->id,
                'user_id' => $admin->id,
                'title' => 'MAN 2 Madiun Raih Juara 1 OSN Provinsi',
                'excerpt' => 'Tim siswa berhasil membawa pulang medali emas.',
                'content' => '<p>Tim siswa MAN 2 Kota Madiun berhasil meraih juara 1 OSN tingkat provinsi.</p>',
                'status' => PublishStatus::Published,
                'published_at' => now(),
                'views' => 128,
            ]
        );

        $services = [
            ['title' => 'PTSP', 'slug' => 'ptsp', 'icon' => 'clipboard-list'],
            ['title' => 'PPDB', 'slug' => 'ppdb', 'icon' => 'graduation-cap'],
            ['title' => 'CBT', 'slug' => 'cbt', 'icon' => 'monitor'],
            ['title' => 'E-Learning', 'slug' => 'e-learning', 'icon' => 'laptop'],
        ];

        foreach ($services as $i => $service) {
            Service::firstOrCreate(
                ['slug' => $service['slug']],
                $service + [
                    'description' => 'Layanan digital MAN 2 Kota Madiun.',
                    'sort_order' => $i + 1,
                    'is_active' => true,
                ]
            );
        }

        app(SettingService::class)->seedDefaults();

        $defaultAchievements = [
            ['title' => 'Juara 1 OSN Provinsi', 'year' => 2026, 'level' => 'Provinsi'],
            ['title' => 'Sekolah Adiwiyata Nasional', 'year' => 2025, 'level' => 'Nasional'],
            ['title' => 'Juara 2 LKS Kabupaten', 'year' => 2025, 'level' => 'Kabupaten'],
            ['title' => 'Best Digital Madrasah', 'year' => 2024, 'level' => 'Nasional'],
            ['title' => 'Juara 1 Paskibra Kota', 'year' => 2024, 'level' => 'Kota'],
            ['title' => 'Akreditasi A', 'year' => 2024, 'level' => 'BAN-S/M'],
        ];

        foreach ($defaultAchievements as $i => $item) {
            Achievement::firstOrCreate(
                ['title' => $item['title'], 'year' => $item['year']],
                $item + ['sort_order' => $i + 1, 'is_active' => true]
            );
        }

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            VisitorStat::firstOrCreate(
                ['date' => $date],
                [
                    'page_views' => rand(80, 350),
                    'unique_visitors' => rand(40, 180),
                ]
            );
        }
    }
}
