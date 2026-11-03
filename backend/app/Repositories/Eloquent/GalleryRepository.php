<?php

namespace App\Repositories\Eloquent;

use App\Models\Gallery;
use App\Repositories\Contracts\GalleryRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GalleryRepository implements GalleryRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Gallery::query()
            ->withCount('images')
            ->with(['images' => fn ($q) => $q->orderBy('sort_order')->limit(4)])
            ->latest();

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $query->where('title', 'like', '%'.$filters['search'].'%');
        }

        return $query->paginate($perPage);
    }

    public function find(int $id): ?Gallery
    {
        return Gallery::with(['images', 'user:id,name'])->find($id);
    }

    public function create(array $data): Gallery
    {
        return Gallery::create($data);
    }

    public function update(Gallery $gallery, array $data): Gallery
    {
        $gallery->update($data);

        return $gallery->fresh(['images', 'user:id,name']);
    }

    public function delete(Gallery $gallery): bool
    {
        return (bool) $gallery->delete();
    }

    public function count(): int
    {
        return Gallery::count();
    }
}
