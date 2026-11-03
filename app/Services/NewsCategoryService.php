<?php

namespace App\Services;

use App\Models\NewsCategory;
use App\Repositories\Contracts\NewsCategoryRepositoryInterface;
use App\Support\SlugGenerator;

class NewsCategoryService
{
    public function __construct(
        private readonly NewsCategoryRepositoryInterface $repository,
    ) {}

    public function list()
    {
        return $this->repository->all();
    }

    public function find(int $id): ?NewsCategory
    {
        return $this->repository->find($id);
    }

    public function create(array $data): NewsCategory
    {
        $data['slug'] = SlugGenerator::unique($data['name'], new NewsCategory);

        return $this->repository->create($data);
    }

    public function update(NewsCategory $category, array $data): NewsCategory
    {
        if (! empty($data['name']) && $data['name'] !== $category->name) {
            $data['slug'] = SlugGenerator::unique($data['name'], new NewsCategory, 'slug', $category->id);
        }

        return $this->repository->update($category, $data);
    }

    public function delete(NewsCategory $category): bool
    {
        return $this->repository->delete($category);
    }
}
