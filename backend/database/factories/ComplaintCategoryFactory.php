<?php

namespace Database\Factories;

use App\Enums\ComplaintPriority;
use App\Models\ComplaintCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ComplaintCategory>
 */
class ComplaintCategoryFactory extends Factory
{
    protected $model = ComplaintCategory::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('###'),
            'description' => fake()->sentence(),
            'is_active' => true,
            'is_sensitive' => false,
            'default_priority' => ComplaintPriority::Normal,
            'sort_order' => 0,
        ];
    }

    public function sensitive(): static
    {
        return $this->state(fn () => [
            'is_sensitive' => true,
            'default_priority' => ComplaintPriority::Urgent,
        ]);
    }
}
