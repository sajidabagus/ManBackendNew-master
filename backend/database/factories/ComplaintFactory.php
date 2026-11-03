<?php

namespace Database\Factories;

use App\Enums\ComplaintPriority;
use App\Enums\ComplaintStatus;
use App\Enums\IdentityMode;
use App\Enums\ReporterType;
use App\Models\Complaint;
use App\Models\ComplaintCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Complaint>
 */
class ComplaintFactory extends Factory
{
    protected $model = Complaint::class;

    public function definition(): array
    {
        return [
            'ticket_number' => sprintf('ADU-%d-%s', now()->year, fake()->unique()->numerify('######')),
            'category_id' => ComplaintCategory::factory(),
            'reporter_type' => ReporterType::Public,
            'identity_mode' => IdentityMode::Identified,
            'title' => fake()->sentence(6),
            'description' => fake()->paragraphs(2, true),
            'status' => ComplaintStatus::Submitted,
            'priority' => ComplaintPriority::Normal,
        ];
    }

    public function anonymous(): static
    {
        return $this->state(fn () => [
            'identity_mode' => IdentityMode::Anonymous,
        ]);
    }
}
