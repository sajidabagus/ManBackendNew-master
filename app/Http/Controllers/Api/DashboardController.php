<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NewsResource;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $days = (int) $request->query('days', 7);
        $analytics = $this->dashboardService->analytics($days);

        return response()->json([
            'stats' => $this->dashboardService->stats(),
            'analytics' => [
                'visitor_chart' => $analytics['visitor_chart'],
                'news_chart' => $analytics['news_chart'],
                'recent_news' => NewsResource::collection($analytics['recent_news'])->resolve(),
            ],
        ]);
    }
}
