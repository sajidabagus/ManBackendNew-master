<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreComplaintCategoryRequest;
use App\Http\Requests\Api\UpdateComplaintCategoryRequest;
use App\Http\Resources\ComplaintCategoryResource;
use App\Models\Complaint;
use App\Models\ComplaintCategory;
use App\Services\ComplaintService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ComplaintCategoryController extends Controller
{
    public function __construct(
        private readonly ComplaintService $complaintService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::forUser($request->user())->authorize('viewAny', Complaint::class);

        $items = $this->complaintService->paginateCategories(
            ['search' => $request->query('search')],
            (int) $request->query('per_page', 20),
        );

        return response()->json([
            'data' => ComplaintCategoryResource::collection($items),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    public function store(StoreComplaintCategoryRequest $request): JsonResponse
    {
        Gate::forUser($request->user())->authorize('manageCategories', Complaint::class);

        $category = $this->complaintService->createCategory($request->validated());

        return response()->json([
            'message' => 'Kategori pengaduan berhasil ditambahkan.',
            'data' => new ComplaintCategoryResource($category),
        ], 201);
    }

    public function update(UpdateComplaintCategoryRequest $request, int $id): JsonResponse
    {
        Gate::forUser($request->user())->authorize('manageCategories', Complaint::class);

        $category = ComplaintCategory::query()->find($id);
        if (! $category) {
            return response()->json(['message' => 'Kategori tidak ditemukan.'], 404);
        }

        $category = $this->complaintService->updateCategory($category, $request->validated());

        return response()->json([
            'message' => 'Kategori pengaduan berhasil diperbarui.',
            'data' => new ComplaintCategoryResource($category),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        Gate::forUser($request->user())->authorize('manageCategories', Complaint::class);

        $category = ComplaintCategory::query()->find($id);
        if (! $category) {
            return response()->json(['message' => 'Kategori tidak ditemukan.'], 404);
        }

        $this->complaintService->deleteCategory($category);

        return response()->json(['message' => 'Kategori pengaduan berhasil dihapus.']);
    }
}
