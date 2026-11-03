<?php

namespace App\Repositories\Eloquent;

use App\Models\NewsCategory;
use App\Repositories\Contracts\NewsCategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class NewsCategoryRepository implements NewsCategoryRepositoryInterface
{
    public function all(): Collection
    {
        return NewsCategory::query()->orderBy('name')->get();
    }

    public function allActive(): Collection
    {
        return NewsCategory::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function find(int $id): ?NewsCategory
    {
        return NewsCategory::find($id);
    }

    public function create(array $data): NewsCategory
    {
        return NewsCategory::create($data);
    }

    public function update(NewsCategory $category, array $data): NewsCategory
    {
        $category->update($data);

        return $category->fresh();
    }

    public function delete(NewsCategory $category): bool
    {
        return (bool) $category->delete();
    }
}
