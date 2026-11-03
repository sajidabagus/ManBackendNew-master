<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreGalleryRequest;
use App\Http\Requests\Api\UpdateGalleryRequest;
use App\Http\Resources\GalleryResource;
use App\Services\GalleryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function __construct(
        private readonly GalleryService $galleryService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $galleries = $this->galleryService->list([
            'status' => $request->query('status'),
            'search' => $request->query('search'),
        ], (int) $request->query('per_page', 12));

        return response()->json([
            'data' => GalleryResource::collection($galleries),
            'meta' => [
                'current_page' => $galleries->currentPage(),
                'last_page' => $galleries->lastPage(),
                'per_page' => $galleries->perPage(),
                'total' => $galleries->total(),
            ],
        ]);
    }

    public function store(StoreGalleryRequest $request): JsonResponse
    {
        $gallery = $this->galleryService->create(
            $request->validated(),
            $request->file('images', []),
            $request->user()->id,
        );

        return response()->json([
            'message' => 'Galeri berhasil dibuat.',
            'data' => new GalleryResource($gallery),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $gallery = $this->galleryService->find($id);

        if (! $gallery) {
            return response()->json(['message' => 'Galeri tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new GalleryResource($gallery)]);
    }

    public function update(UpdateGalleryRequest $request, int $id): JsonResponse
    {
        $gallery = $this->galleryService->find($id);

        if (! $gallery) {
            return response()->json(['message' => 'Galeri tidak ditemukan.'], 404);
        }

        $gallery = $this->galleryService->update(
            $gallery,
            $request->validated(),
            $request->file('images', []),
        );

        return response()->json([
            'message' => 'Galeri berhasil diperbarui.',
            'data' => new GalleryResource($gallery),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $gallery = $this->galleryService->find($id);

        if (! $gallery) {
            return response()->json(['message' => 'Galeri tidak ditemukan.'], 404);
        }

        $this->galleryService->delete($gallery);

        return response()->json(['message' => 'Galeri berhasil dihapus.']);
    }

    public function destroyImage(int $galleryId, int $imageId): JsonResponse
    {
        $gallery = $this->galleryService->find($galleryId);

        if (! $gallery) {
            return response()->json(['message' => 'Galeri tidak ditemukan.'], 404);
        }

        $image = $gallery->images()->where('id', $imageId)->first();

        if (! $image) {
            return response()->json(['message' => 'Gambar tidak ditemukan.'], 404);
        }

        $this->galleryService->deleteImage($image);

        return response()->json(['message' => 'Gambar berhasil dihapus.']);
    }
}
