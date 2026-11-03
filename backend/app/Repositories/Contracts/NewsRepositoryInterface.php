<?php

namespace App\Repositories\Contracts;

use App\Models\News;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface NewsRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function find(int $id): ?News;

    public function create(array $data): News;

    public function update(News $news, array $data): News;

    public function delete(News $news): bool;

    public function count(): int;

    public function recentPublished(int $limit = 5): Collection;
}
