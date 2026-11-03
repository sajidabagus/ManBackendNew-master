<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Services\TestimonialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function __construct(
        private readonly TestimonialService $testimonialService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->testimonialService->paginate(
            ['search' => $request->query('search')],
            (int) $request->query('per_page', 15),
        );

        return response()->json([
            'data' => TestimonialResource::collection($items),
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
        $this->normalizeInput($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'graduation_year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'quote' => ['required', 'string'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ]);

        $testimonial = $this->testimonialService->create($data, $request->file('photo'));

        return response()->json([
            'message' => 'Testimoni berhasil ditambahkan.',
            'data' => new TestimonialResource($testimonial),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $testimonial = $this->testimonialService->find($id);

        if (! $testimonial) {
            return response()->json(['message' => 'Testimoni tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new TestimonialResource($testimonial)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $testimonial = $this->testimonialService->find($id);

        if (! $testimonial) {
            return response()->json(['message' => 'Testimoni tidak ditemukan.'], 404);
        }

        $this->normalizeInput($request);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'graduation_year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'quote' => ['sometimes', 'required', 'string'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ]);

        $testimonial = $this->testimonialService->update($testimonial, $data, $request->file('photo'));

        return response()->json([
            'message' => 'Testimoni berhasil diperbarui.',
            'data' => new TestimonialResource($testimonial),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $testimonial = $this->testimonialService->find($id);

        if (! $testimonial) {
            return response()->json(['message' => 'Testimoni tidak ditemukan.'], 404);
        }

        $this->testimonialService->delete($testimonial);

        return response()->json(['message' => 'Testimoni berhasil dihapus.']);
    }

    private function normalizeInput(Request $request): void
    {
        if ($request->has('is_active')) {
            $request->merge([
                'is_active' => filter_var(
                    $request->input('is_active'),
                    FILTER_VALIDATE_BOOLEAN,
                    FILTER_NULL_ON_FAILURE,
                ) ?? false,
            ]);
        }

        if ($request->input('graduation_year') === '' || $request->input('graduation_year') === 'NaN') {
            $request->merge(['graduation_year' => null]);
        }
    }
}
