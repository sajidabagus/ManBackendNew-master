<?php

namespace App\Services;

use App\Enums\PublishStatus;
use App\Models\Gallery;
use App\Models\News;
use App\Models\Service;
use App\Models\Setting;
use App\Models\VisitorStat;
use App\Repositories\Contracts\NewsRepositoryInterface;
use Carbon\Carbon;

class PublicService
{
    public function __construct(
        private readonly NewsRepositoryInterface $newsRepository,
        private readonly SettingService $settingService,
        private readonly AchievementService $achievementService,
        private readonly FaqService $faqService,
        private readonly TestimonialService $testimonialService,
    ) {}

    public function home(): array
    {
        $settings = $this->settingService->getGrouped();

        $data = [
            'settings' => $settings,
            'news' => News::query()
                ->with(['category:id,name,slug'])
                ->where('status', PublishStatus::Published)
                ->latest('published_at')
                ->limit(6)
                ->get(),
            'services' => Service::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
            'achievements' => $this->achievementService->activeList(),
            'faqs' => $this->faqService->activeList(),
            'testimonials' => $this->testimonialService->activeList(),
            'galleries' => Gallery::query()
                ->with(['images' => fn ($q) => $q->orderBy('sort_order')])
                ->where('status', PublishStatus::Published)
                ->latest('published_at')
                ->limit(4)
                ->get(),
            'stats' => $this->publicStats($settings),
        ];

        defer(function (): void {
            try {
                $this->recordVisit();
            } catch (\Throwable $e) {
                report($e);
            }
        });

        return $data;
    }

    public function galleries()
    {
        return Gallery::query()
            ->with(['images' => fn ($q) => $q->orderBy('sort_order')])
            ->where('status', PublishStatus::Published)
            ->latest('published_at')
            ->get();
    }

    public function newsList(int $perPage = 12)
    {
        return News::query()
            ->with(['category:id,name,slug'])
            ->where('status', PublishStatus::Published)
            ->latest('published_at')
            ->paginate($perPage);
    }

    public function newsBySlug(string $slug): ?News
    {
        $news = News::query()
            ->with(['category', 'author:id,name'])
            ->where('slug', $slug)
            ->where('status', PublishStatus::Published)
            ->first();

        if ($news) {
            $news->increment('views');
        }

        return $news;
    }

    private function publicStats(array $settings): array
    {
        $stats = $settings['stats'] ?? [];

        return [
            'total_students' => (int) ($stats['total_students'] ?? 1248),
            'total_teachers' => (int) ($stats['total_teachers'] ?? 86),
            'total_prestasi' => (int) ($stats['total_prestasi'] ?? 320),
            'total_ruang' => (int) ($stats['total_ruang'] ?? 36),
        ];
    }

    private function recordVisit(): void
    {
        $today = Carbon::today();

        $stat = VisitorStat::firstOrCreate(
            ['date' => $today],
            ['page_views' => 0, 'unique_visitors' => 0]
        );

        $stat->increment('page_views');
    }
}
