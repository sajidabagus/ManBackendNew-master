<?php

namespace App\Providers;

use App\Repositories\Contracts\GalleryRepositoryInterface;
use App\Repositories\Contracts\NewsCategoryRepositoryInterface;
use App\Repositories\Contracts\NewsRepositoryInterface;
use App\Repositories\Eloquent\GalleryRepository;
use App\Repositories\Eloquent\NewsCategoryRepository;
use App\Repositories\Eloquent\NewsRepository;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(NewsRepositoryInterface::class, NewsRepository::class);
        $this->app->bind(GalleryRepositoryInterface::class, GalleryRepository::class);
        $this->app->bind(NewsCategoryRepositoryInterface::class, NewsCategoryRepository::class);
    }

    public function boot(): void
    {
        JsonResource::withoutWrapping();

        RateLimiter::for('complaint-submit', function (Request $request) {
            return Limit::perHour(8)->by($request->ip())->response(function () {
                return response()->json([
                    'message' => 'Terlalu banyak percobaan. Silakan coba beberapa saat lagi.',
                ], 429);
            });
        });

        RateLimiter::for('complaint-track', function (Request $request) {
            return Limit::perMinutes(15, 5)->by($request->ip())->response(function () {
                return response()->json([
                    'message' => 'Terlalu banyak percobaan. Silakan coba beberapa saat lagi.',
                ], 429);
            });
        });

        RateLimiter::for('complaint-message', function (Request $request) {
            return Limit::perHour(10)->by($request->ip())->response(function () {
                return response()->json([
                    'message' => 'Terlalu banyak percobaan. Silakan coba beberapa saat lagi.',
                ], 429);
            });
        });
    }
}
