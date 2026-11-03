<?php

namespace App\Services;

use App\Models\Achievement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class AchievementService
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Achievement::query()->orderBy('sort_order')->orderByDesc('year');

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('title', 'like', '%'.$filters['search'].'%')
                    ->orWhere('level', 'like', '%'.$filters['search'].'%');
            });
        }

        return $query->paginate($perPage);
    }

    public function activeList(): Collection
    {
        return Achievement::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('year')
            ->get();
    }

    public function find(int $id): ?Achievement
    {
        return Achievement::find($id);
    }

    public function create(array $data): Achievement
    {
        return Achievement::create($data);
    }

    public function update(Achievement $achievement, array $data): Achievement
    {
        $achievement->update($data);

        return $achievement->fresh();
    }

    public function delete(Achievement $achievement): bool
    {
        return (bool) $achievement->delete();
    }
}
