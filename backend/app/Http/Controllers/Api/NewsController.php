<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreNewsRequest;
use App\Http\Requests\Api\UpdateNewsRequest;
use App\Http\Resources\NewsResource;
use App\Services\NewsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function __construct(
        private readonly NewsService $newsService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $news = $this->newsService->list([
            'status' => $request->query('status'),
            'category_id' => $request->query('category_id'),
            'search' => $request->query('search'),
        ], (int) $request->query('per_page', 15));

        return response()->json([
            'data' => NewsResource::collection($news),
            'meta' => [
                'current_page' => $news->currentPage(),
                'last_page' => $news->lastPage(),
                'per_page' => $news->perPage(),
                'total' => $news->total(),
            ],
        ]);
    }

    public function store(StoreNewsRequest $request): JsonResponse
    {
        $news = $this->newsService->create(
            $request->validated(),
            $request->file('thumbnail'),
            $request->user()->id,
        );

        return response()->json([
            'message' => 'Berita berhasil dibuat.',
            'data' => new NewsResource($news->load(['category', 'author'])),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $news = $this->newsService->find($id);

        if (! $news) {
            return response()->json(['message' => 'Berita tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new NewsResource($news)]);
    }

    public function update(UpdateNewsRequest $request, int $id): JsonResponse
    {
        $news = $this->newsService->find($id);

        if (! $news) {
            return response()->json(['message' => 'Berita tidak ditemukan.'], 404);
        }

        $news = $this->newsService->update(
            $news,
            $request->validated(),
            $request->file('thumbnail'),
        );

        return response()->json([
            'message' => 'Berita berhasil diperbarui.',
            'data' => new NewsResource($news),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $news = $this->newsService->find($id);

        if (! $news) {
            return response()->json(['message' => 'Berita tidak ditemukan.'], 404);
        }

        $this->newsService->delete($news);

        return response()->json(['message' => 'Berita berhasil dihapus.']);
    }
}
