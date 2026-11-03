<?php

namespace App\Repositories\Contracts;

use App\Models\NewsCategory;
use Illuminate\Database\Eloquent\Collection;

interface NewsCategoryRepositoryInterface
{
    public function all(): Collection;

    public function allActive(): Collection;

    public function find(int $id): ?NewsCategory;

    public function create(array $data): NewsCategory;

    public function update(NewsCategory $category, array $data): NewsCategory;

    public function delete(NewsCategory $category): bool;
}
