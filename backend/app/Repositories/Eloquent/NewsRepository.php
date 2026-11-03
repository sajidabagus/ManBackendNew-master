<?php

namespace App\Repositories\Eloquent;

use App\Enums\PublishStatus;
use App\Models\News;
use App\Repositories\Contracts\NewsRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class NewsRepository implements NewsRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = News::query()
            ->with(['category:id,name,slug', 'author:id,name'])
            ->latest();

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['category_id'])) {
            $query->where('news_category_id', $filters['category_id']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function find(int $id): ?News
    {
        return News::with(['category', 'author:id,name,email'])->find($id);
    }

    public function create(array $data): News
    {
        return News::create($data);
    }

    public function update(News $news, array $data): News
    {
        $news->update($data);

        return $news->fresh(['category', 'author:id,name,email']);
    }

    public function delete(News $news): bool
    {
        return (bool) $news->delete();
    }

    public function count(): int
    {
        return News::count();
    }

    public function recentPublished(int $limit = 5): Collection
    {
        return News::query()
            ->where('status', PublishStatus::Published)
            ->latest('published_at')
            ->limit($limit)
            ->get(['id', 'title', 'slug', 'published_at', 'views']);
    }
}
