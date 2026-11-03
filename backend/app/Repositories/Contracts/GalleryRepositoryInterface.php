<?php

namespace App\Repositories\Contracts;

use App\Models\Gallery;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface GalleryRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 12): LengthAwarePaginator;

    public function find(int $id): ?Gallery;

    public function create(array $data): Gallery;

    public function update(Gallery $gallery, array $data): Gallery;

    public function delete(Gallery $gallery): bool;

    public function count(): int;
}
