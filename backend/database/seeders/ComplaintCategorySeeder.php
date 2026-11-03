<?php

namespace Database\Seeders;

use App\Enums\ComplaintPriority;
use App\Models\ComplaintCategory;
use Illuminate\Database\Seeder;

class ComplaintCategorySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => 'Sarana dan prasarana', 'slug' => 'sarana-dan-prasarana', 'priority' => ComplaintPriority::Normal, 'sensitive' => false],
            ['name' => 'Pelayanan sekolah', 'slug' => 'pelayanan-sekolah', 'priority' => ComplaintPriority::Normal, 'sensitive' => false],
            ['name' => 'Pembelajaran', 'slug' => 'pembelajaran', 'priority' => ComplaintPriority::Normal, 'sensitive' => false],
            ['name' => 'Kesiswaan', 'slug' => 'kesiswaan', 'priority' => ComplaintPriority::Normal, 'sensitive' => false],
            ['name' => 'Perundungan atau bullying', 'slug' => 'perundungan-atau-bullying', 'priority' => ComplaintPriority::Urgent, 'sensitive' => true],
            ['name' => 'Dugaan kekerasan atau pelanggaran', 'slug' => 'dugaan-kekerasan-atau-pelanggaran', 'priority' => ComplaintPriority::Urgent, 'sensitive' => true],
            ['name' => 'Integritas', 'slug' => 'integritas', 'priority' => ComplaintPriority::High, 'sensitive' => true],
            ['name' => 'Kritik dan saran', 'slug' => 'kritik-dan-saran', 'priority' => ComplaintPriority::Low, 'sensitive' => false],
            ['name' => 'Lainnya', 'slug' => 'lainnya', 'priority' => ComplaintPriority::Normal, 'sensitive' => false],
        ];

        foreach ($items as $index => $item) {
            ComplaintCategory::query()->firstOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'description' => null,
                    'is_active' => true,
                    'is_sensitive' => $item['sensitive'],
                    'default_priority' => $item['priority'],
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}
