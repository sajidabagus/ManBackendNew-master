<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Services\ServiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function __construct(
        private readonly ServiceService $serviceService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->serviceService->paginate(
            ['search' => $request->query('search')],
            (int) $request->query('per_page', 15)
        );

        return response()->json([
            'data' => ServiceResource::collection($items),
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
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'url' => ['nullable', 'url', 'max:500'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $service = $this->serviceService->create($data);

        return response()->json([
            'message' => 'Layanan berhasil dibuat.',
            'data' => new ServiceResource($service),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $service = $this->serviceService->find($id);

        if (! $service) {
            return response()->json(['message' => 'Layanan tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new ServiceResource($service)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $service = $this->serviceService->find($id);

        if (! $service) {
            return response()->json(['message' => 'Layanan tidak ditemukan.'], 404);
        }

        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'url' => ['nullable', 'url', 'max:500'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $service = $this->serviceService->update($service, $data);

        return response()->json([
            'message' => 'Layanan berhasil diperbarui.',
            'data' => new ServiceResource($service),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $service = $this->serviceService->find($id);

        if (! $service) {
            return response()->json(['message' => 'Layanan tidak ditemukan.'], 404);
        }

        $this->serviceService->delete($service);

        return response()->json(['message' => 'Layanan berhasil dihapus.']);
    }
}
