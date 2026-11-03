<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NewsCategoryResource;
use App\Services\NewsCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsCategoryController extends Controller
{
    public function __construct(
        private readonly NewsCategoryService $categoryService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $categories = $request->boolean('active_only')
            ? app(\App\Repositories\Contracts\NewsCategoryRepositoryInterface::class)->allActive()
            : $this->categoryService->list();

        return response()->json([
            'data' => NewsCategoryResource::collection($categories),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $category = $this->categoryService->create($data);

        return response()->json([
            'message' => 'Kategori berhasil dibuat.',
            'data' => new NewsCategoryResource($category),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = $this->categoryService->find($id);

        if (! $category) {
            return response()->json(['message' => 'Kategori tidak ditemukan.'], 404);
        }

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $category = $this->categoryService->update($category, $data);

        return response()->json([
            'message' => 'Kategori berhasil diperbarui.',
            'data' => new NewsCategoryResource($category),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $category = $this->categoryService->find($id);

        if (! $category) {
            return response()->json(['message' => 'Kategori tidak ditemukan.'], 404);
        }

        $this->categoryService->delete($category);

        return response()->json(['message' => 'Kategori berhasil dihapus.']);
    }
}
