<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Services\FaqService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function __construct(
        private readonly FaqService $faqService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->faqService->paginate(
            ['search' => $request->query('search')],
            (int) $request->query('per_page', 15),
        );

        return response()->json([
            'data' => FaqResource::collection($items),
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
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $faq = $this->faqService->create($data);

        return response()->json([
            'message' => 'FAQ berhasil ditambahkan.',
            'data' => new FaqResource($faq),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $faq = $this->faqService->find($id);

        if (! $faq) {
            return response()->json(['message' => 'FAQ tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new FaqResource($faq)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $faq = $this->faqService->find($id);

        if (! $faq) {
            return response()->json(['message' => 'FAQ tidak ditemukan.'], 404);
        }

        $data = $request->validate([
            'question' => ['sometimes', 'required', 'string', 'max:500'],
            'answer' => ['sometimes', 'required', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $faq = $this->faqService->update($faq, $data);

        return response()->json([
            'message' => 'FAQ berhasil diperbarui.',
            'data' => new FaqResource($faq),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $faq = $this->faqService->find($id);

        if (! $faq) {
            return response()->json(['message' => 'FAQ tidak ditemukan.'], 404);
        }

        $this->faqService->delete($faq);

        return response()->json(['message' => 'FAQ berhasil dihapus.']);
    }
}
