<?php

namespace App\Services;

use App\Enums\PublishStatus;
use App\Models\News;
use App\Repositories\Contracts\NewsRepositoryInterface;
use App\Support\SlugGenerator;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class NewsService
{
    public function __construct(
        private readonly NewsRepositoryInterface $newsRepository,
    ) {}

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->newsRepository->paginate($filters, $perPage);
    }

    public function find(int $id): ?News
    {
        return $this->newsRepository->find($id);
    }

    public function create(array $data, ?UploadedFile $thumbnail = null, ?int $userId = null): News
    {
        $data['slug'] = SlugGenerator::unique($data['title'], new News);
        $data['user_id'] = $userId;

        if (($data['status'] ?? 'draft') === PublishStatus::Published->value) {
            $data['published_at'] = $data['published_at'] ?? now();
        }

        if ($thumbnail) {
            $data['thumbnail'] = $this->storeThumbnail($thumbnail);
        }

        return $this->newsRepository->create($data);
    }

    public function update(News $news, array $data, ?UploadedFile $thumbnail = null): News
    {
        if (! empty($data['title']) && $data['title'] !== $news->title) {
            $data['slug'] = SlugGenerator::unique($data['title'], new News, 'slug', $news->id);
        }

        if (($data['status'] ?? $news->status->value) === PublishStatus::Published->value && ! $news->published_at) {
            $data['published_at'] = $data['published_at'] ?? now();
        }

        if ($thumbnail) {
            if ($news->thumbnail) {
                Storage::disk('public')->delete($news->thumbnail);
            }
            $data['thumbnail'] = $this->storeThumbnail($thumbnail);
        }

        return $this->newsRepository->update($news, $data);
    }

    public function delete(News $news): bool
    {
        if ($news->thumbnail) {
            Storage::disk('public')->delete($news->thumbnail);
        }

        return $this->newsRepository->delete($news);
    }

    private function storeThumbnail(UploadedFile $file): string
    {
        return $file->store('news/thumbnails', 'public');
    }
}
