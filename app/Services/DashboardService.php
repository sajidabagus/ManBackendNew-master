<?php

namespace App\Services;

use App\Enums\PublishStatus;
use App\Models\News;
use App\Models\Service;
use App\Models\Setting;
use App\Models\VisitorStat;
use App\Repositories\Contracts\GalleryRepositoryInterface;
use App\Repositories\Contracts\NewsRepositoryInterface;
use Carbon\Carbon;

class DashboardService
{
    public function __construct(
        private readonly NewsRepositoryInterface $newsRepository,
        private readonly GalleryRepositoryInterface $galleryRepository,
    ) {}

    public function stats(): array
    {
        $totalStudents = (int) Setting::where('key', 'total_students')->value('value') ?: 1248;
        $totalNews = $this->newsRepository->count();
        $totalServices = Service::where('is_active', true)->count();
        $totalGalleries = $this->galleryRepository->count();
        $publishedNews = News::where('status', PublishStatus::Published)->count();
        $draftNews = News::where('status', PublishStatus::Draft)->count();

        $visitorTotal = VisitorStat::sum('page_views');
        $visitorToday = VisitorStat::whereDate('date', today())->value('page_views') ?? 0;

        return [
            'total_students' => $totalStudents,
            'total_news' => $totalNews,
            'total_services' => $totalServices,
            'total_galleries' => $totalGalleries,
            'published_news' => $publishedNews,
            'draft_news' => $draftNews,
            'visitor_total' => (int) $visitorTotal,
            'visitor_today' => (int) $visitorToday,
        ];
    }

    public function analytics(int $days = 7): array
    {
        $start = Carbon::today()->subDays($days - 1);

        $stats = VisitorStat::query()
            ->where('date', '>=', $start)
            ->orderBy('date')
            ->get()
            ->keyBy(fn ($item) => $item->date->format('Y-m-d'));

        $labels = [];
        $pageViews = [];
        $uniqueVisitors = [];

        for ($i = 0; $i < $days; $i++) {
            $date = $start->copy()->addDays($i);
            $key = $date->format('Y-m-d');
            $labels[] = $date->translatedFormat('d M');
            $pageViews[] = $stats[$key]->page_views ?? 0;
            $uniqueVisitors[] = $stats[$key]->unique_visitors ?? 0;
        }

        $newsByMonth = News::query()
            ->where('created_at', '>=', now()->subMonths(6))
            ->get(['created_at'])
            ->groupBy(fn ($item) => $item->created_at->format('Y-m'))
            ->map(fn ($items, $month) => ['month' => $month, 'total' => $items->count()])
            ->sortKeys()
            ->values();

        if ($newsByMonth->isEmpty()) {
            $newsByMonth = collect([
                ['month' => now()->format('Y-m'), 'total' => News::count()],
            ]);
        }

        return [
            'visitor_chart' => [
                'labels' => $labels,
                'page_views' => $pageViews,
                'unique_visitors' => $uniqueVisitors,
            ],
            'news_chart' => $newsByMonth,
            'recent_news' => $this->newsRepository->recentPublished(5),
        ];
    }
}
