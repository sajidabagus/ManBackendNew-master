<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AchievementResource;
use App\Services\AchievementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function __construct(
        private readonly AchievementService $achievementService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->achievementService->paginate(
            ['search' => $request->query('search')],
            (int) $request->query('per_page', 15),
        );

        return response()->json([
            'data' => AchievementResource::collection($items),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1900', 'max:2100'],
            'level' => ['required', 'string', 'max:100'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $achievement = $this->achievementService->create($data);

        return response()->json([
            'message' => 'Prestasi berhasil ditambahkan.',
            'data' => new AchievementResource($achievement),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $achievement = $this->achievementService->find($id);

        if (! $achievement) {
            return response()->json(['message' => 'Prestasi tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new AchievementResource($achievement)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $achievement = $this->achievementService->find($id);

        if (! $achievement) {
            return response()->json(['message' => 'Prestasi tidak ditemukan.'], 404);
        }

        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'year' => ['sometimes', 'required', 'integer', 'min:1900', 'max:2100'],
            'level' => ['sometimes', 'required', 'string', 'max:100'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $achievement = $this->achievementService->update($achievement, $data);

        return response()->json([
            'message' => 'Prestasi berhasil diperbarui.',
            'data' => new AchievementResource($achievement),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $achievement = $this->achievementService->find($id);

        if (! $achievement) {
            return response()->json(['message' => 'Prestasi tidak ditemukan.'], 404);
        }

        $this->achievementService->delete($achievement);

        return response()->json(['message' => 'Prestasi berhasil dihapus.']);
    }
}
