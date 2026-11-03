<?php

namespace App\Services;

use App\Models\Service;
use App\Support\SlugGenerator;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ServiceService
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Service::query()->orderBy('sort_order');

        if (! empty($filters['search'])) {
            $query->where('title', 'like', '%'.$filters['search'].'%');
        }

        return $query->paginate($perPage);
    }

    public function find(int $id): ?Service
    {
        return Service::find($id);
    }

    public function create(array $data): Service
    {
        $data['slug'] = SlugGenerator::unique($data['title'], new Service);

        return Service::create($data);
    }

    public function update(Service $service, array $data): Service
    {
        if (! empty($data['title']) && $data['title'] !== $service->title) {
            $data['slug'] = SlugGenerator::unique($data['title'], new Service, 'slug', $service->id);
        }

        return tap($service)->update($data)->fresh();
    }

    public function delete(Service $service): bool
    {
        return (bool) $service->delete();
    }
}
