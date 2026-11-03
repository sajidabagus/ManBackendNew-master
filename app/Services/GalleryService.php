<?php

namespace App\Services;

use App\Enums\PublishStatus;
use App\Models\Gallery;
use App\Models\GalleryImage;
use App\Repositories\Contracts\GalleryRepositoryInterface;
use App\Support\SlugGenerator;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GalleryService
{
    public function __construct(
        private readonly GalleryRepositoryInterface $galleryRepository,
    ) {}

    public function list(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        return $this->galleryRepository->paginate($filters, $perPage);
    }

    public function find(int $id): ?Gallery
    {
        return $this->galleryRepository->find($id);
    }

    public function create(array $data, array $images = [], ?int $userId = null): Gallery
    {
        return DB::transaction(function () use ($data, $images, $userId) {
            $data['slug'] = SlugGenerator::unique($data['title'], new Gallery);
            $data['user_id'] = $userId;

            if (($data['status'] ?? 'draft') === PublishStatus::Published->value) {
                $data['published_at'] = $data['published_at'] ?? now();
            }

            $gallery = $this->galleryRepository->create($data);
            $this->attachImages($gallery, $images);

            return $gallery->load('images');
        });
    }

    public function update(Gallery $gallery, array $data, array $newImages = []): Gallery
    {
        return DB::transaction(function () use ($gallery, $data, $newImages) {
            if (! empty($data['title']) && $data['title'] !== $gallery->title) {
                $data['slug'] = SlugGenerator::unique($data['title'], new Gallery, 'slug', $gallery->id);
            }

            if (($data['status'] ?? $gallery->status->value) === PublishStatus::Published->value && ! $gallery->published_at) {
                $data['published_at'] = $data['published_at'] ?? now();
            }

            $gallery = $this->galleryRepository->update($gallery, $data);

            if (! empty($newImages)) {
                $this->attachImages($gallery, $newImages);
            }

            return $gallery->load('images');
        });
    }

    public function delete(Gallery $gallery): bool
    {
        return DB::transaction(function () use ($gallery) {
            foreach ($gallery->images as $image) {
                $this->deleteImageFile($image);
            }

            return $this->galleryRepository->delete($gallery);
        });
    }

    public function deleteImage(GalleryImage $image): void
    {
        $this->deleteImageFile($image);
        $image->delete();
    }

    private function attachImages(Gallery $gallery, array $images): void
    {
        $sortOrder = $gallery->images()->max('sort_order') ?? 0;

        foreach ($images as $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $sortOrder++;
            $path = $file->store('galleries/'.$gallery->id, 'public');

            $gallery->images()->create([
                'path' => $path,
                'alt' => $gallery->title,
                'sort_order' => $sortOrder,
            ]);
        }
    }

    private function deleteImageFile(GalleryImage $image): void
    {
        Storage::disk('public')->delete($image->path);
    }
}
