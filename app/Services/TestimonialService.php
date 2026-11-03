<?php

namespace App\Services;

use App\Models\Testimonial;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class TestimonialService
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Testimonial::query()->orderBy('sort_order')->orderByDesc('graduation_year');

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', '%'.$filters['search'].'%')
                    ->orWhere('occupation', 'like', '%'.$filters['search'].'%')
                    ->orWhere('quote', 'like', '%'.$filters['search'].'%');
            });
        }

        return $query->paginate($perPage);
    }

    public function activeList(): Collection
    {
        return Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('graduation_year')
            ->get();
    }

    public function find(int $id): ?Testimonial
    {
        return Testimonial::find($id);
    }

    public function create(array $data, ?UploadedFile $photo = null): Testimonial
    {
        if ($photo) {
            $data['photo'] = $photo->store('testimonials', 'public');
        }

        return Testimonial::create($data);
    }

    public function update(Testimonial $testimonial, array $data, ?UploadedFile $photo = null): Testimonial
    {
        if ($photo) {
            if ($testimonial->photo) {
                Storage::disk('public')->delete($testimonial->photo);
            }
            $data['photo'] = $photo->store('testimonials', 'public');
        }

        $testimonial->update($data);

        return $testimonial->fresh();
    }

    public function delete(Testimonial $testimonial): bool
    {
        if ($testimonial->photo) {
            Storage::disk('public')->delete($testimonial->photo);
        }

        return (bool) $testimonial->delete();
    }
}
