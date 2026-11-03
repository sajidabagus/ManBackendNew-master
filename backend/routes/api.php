<?php

use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ComplaintCategoryController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\NewsCategoryController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PublicComplaintController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('public')->group(function () {
    Route::get('/home', [PublicController::class, 'home']);
    Route::get('/galleries', [PublicController::class, 'galleries']);
    Route::get('/news', [PublicController::class, 'news']);
    Route::get('/news/{slug}', [PublicController::class, 'newsShow']);
    Route::get('/complaint-categories', [PublicComplaintController::class, 'categories']);
    Route::post('/complaints', [PublicComplaintController::class, 'store'])->middleware('throttle:complaint-submit');
    Route::post('/complaints/track', [PublicComplaintController::class, 'track'])->middleware('throttle:complaint-track');
    Route::get('/complaints/{ticket}/status', [PublicComplaintController::class, 'status'])->middleware('throttle:complaint-track');
    Route::post('/complaints/{ticket}/messages', [PublicComplaintController::class, 'message'])->middleware('throttle:complaint-message');
    Route::get('/complaints/{ticket}/attachments/{attachment}', [PublicComplaintController::class, 'attachment'])->middleware('throttle:complaint-track');
});

Route::prefix('auth')->group(function () {
    Route::get('/captcha', [AuthController::class, 'captcha']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('permission:dashboard.view');

    // Berita dan kategori berita
    Route::get('/news', [NewsController::class, 'index'])->middleware('permission:news.view');
    Route::get('/news/{id}', [NewsController::class, 'show'])->whereNumber('id')->middleware('permission:news.view');
    Route::post('/news', [NewsController::class, 'store'])->middleware('permission:news.create');
    Route::put('/news/{id}', [NewsController::class, 'update'])->middleware('permission:news.update');
    Route::patch('/news/{id}', [NewsController::class, 'update'])->middleware('permission:news.update');
    Route::delete('/news/{id}', [NewsController::class, 'destroy'])->middleware('permission:news.delete');
    Route::get('/news/categories', [NewsCategoryController::class, 'index'])->middleware('permission:news.view');
    Route::post('/news/categories', [NewsCategoryController::class, 'store'])->middleware('permission:news.create');
    Route::put('/news/categories/{id}', [NewsCategoryController::class, 'update'])->middleware('permission:news.update');
    Route::delete('/news/categories/{id}', [NewsCategoryController::class, 'destroy'])->middleware('permission:news.delete');

    // Galeri
    Route::get('/gallery', [GalleryController::class, 'index'])->middleware('permission:gallery.view');
    Route::get('/gallery/{id}', [GalleryController::class, 'show'])->whereNumber('id')->middleware('permission:gallery.view');
    Route::post('/gallery', [GalleryController::class, 'store'])->middleware('permission:gallery.create');
    Route::put('/gallery/{id}', [GalleryController::class, 'update'])->middleware('permission:gallery.update');
    Route::patch('/gallery/{id}', [GalleryController::class, 'update'])->middleware('permission:gallery.update');
    Route::delete('/gallery/{id}', [GalleryController::class, 'destroy'])->middleware('permission:gallery.delete');
    Route::delete('/gallery/{gallery}/images/{image}', [GalleryController::class, 'destroyImage'])->middleware('permission:gallery.update');

    // Konten website lainnya
    $contentResources = [
        'services' => [ServiceController::class, 'services'],
        'achievements' => [AchievementController::class, 'achievements'],
        'faqs' => [FaqController::class, 'faqs'],
        'testimonials' => [TestimonialController::class, 'testimonials'],
    ];
    foreach ($contentResources as $uri => [$controller, $permissionPrefix]) {
        Route::get("/{$uri}", [$controller, 'index'])->middleware("permission:{$permissionPrefix}.view");
        Route::get("/{$uri}/{id}", [$controller, 'show'])->whereNumber('id')->middleware("permission:{$permissionPrefix}.view");
        Route::post("/{$uri}", [$controller, 'store'])->middleware("permission:{$permissionPrefix}.create");
        Route::put("/{$uri}/{id}", [$controller, 'update'])->middleware("permission:{$permissionPrefix}.update");
        Route::patch("/{$uri}/{id}", [$controller, 'update'])->middleware("permission:{$permissionPrefix}.update");
        Route::delete("/{$uri}/{id}", [$controller, 'destroy'])->middleware("permission:{$permissionPrefix}.delete");
    }

    // Pengaturan website dan manajemen pengguna: khusus superadmin
    Route::middleware('permission:settings.manage')->group(function () {
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);
        Route::post('/settings/logo', [SettingController::class, 'uploadLogo']);
        Route::delete('/settings/logo', [SettingController::class, 'deleteLogo']);
        Route::post('/settings/hero-image', [SettingController::class, 'uploadHeroImage']);
        Route::delete('/settings/hero-image', [SettingController::class, 'deleteHeroImage']);
        Route::post('/settings/principal-photo', [SettingController::class, 'uploadPrincipalPhoto']);
        Route::delete('/settings/principal-photo', [SettingController::class, 'deletePrincipalPhoto']);
        Route::post('/settings/integrity-image', [SettingController::class, 'uploadIntegrityImage']);
        Route::delete('/settings/integrity-image', [SettingController::class, 'deleteIntegrityImage']);
        Route::post('/settings/org-chart-image', [SettingController::class, 'uploadOrgChartImage']);
        Route::delete('/settings/org-chart-image', [SettingController::class, 'deleteOrgChartImage']);
    });

    Route::middleware('permission:users.manage')->group(function () {
        Route::get('/users/roles', [UserController::class, 'roles']);
        Route::apiResource('users', UserController::class);
    });

    // Pengaduan tetap memakai ComplaintPolicy untuk otorisasi per aksi dan data sensitif.
    Route::get('/complaints/dashboard', [ComplaintController::class, 'dashboard']);
    Route::get('/complaints/export', [ComplaintController::class, 'export']);
    Route::get('/complaints', [ComplaintController::class, 'index']);
    Route::get('/complaints/{id}', [ComplaintController::class, 'show']);
    Route::patch('/complaints/{id}/status', [ComplaintController::class, 'updateStatus']);
    Route::post('/complaints/{id}/assign', [ComplaintController::class, 'assign']);
    Route::post('/complaints/{id}/messages', [ComplaintController::class, 'message']);
    Route::get('/complaints/{id}/attachments/{attachmentId}', [ComplaintController::class, 'attachment']);

    Route::get('/complaint-categories', [ComplaintCategoryController::class, 'index'])->middleware('permission:complaints.view');
    Route::post('/complaint-categories', [ComplaintCategoryController::class, 'store'])->middleware('permission:complaints.manage_categories');
    Route::put('/complaint-categories/{id}', [ComplaintCategoryController::class, 'update'])->middleware('permission:complaints.manage_categories');
    Route::delete('/complaint-categories/{id}', [ComplaintCategoryController::class, 'destroy'])->middleware('permission:complaints.manage_categories');
});
