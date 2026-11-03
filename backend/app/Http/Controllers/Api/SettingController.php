<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SettingResource;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function __construct(
        private readonly SettingService $settingService,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => SettingResource::collection($this->settingService->all()),
            'grouped' => $this->settingService->getGrouped(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable', 'string'],
        ]);

        $this->settingService->updateBulk($data['settings']);

        return response()->json([
            'message' => 'Pengaturan berhasil disimpan.',
            'data' => SettingResource::collection($this->settingService->all()),
        ]);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $data = $request->validate([
            'logo' => ['required', 'image', 'max:2048'],
        ]);

        $url = $this->settingService->updateLogo($data['logo']);

        return response()->json([
            'message' => 'Logo berhasil diunggah.',
            'logo_url' => $url,
        ]);
    }

    public function deleteLogo(): JsonResponse
    {
        $this->settingService->deleteLogo();

        return response()->json([
            'message' => 'Logo berhasil dihapus.',
        ]);
    }

    public function uploadHeroImage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'max:8192'],
        ]);

        $url = $this->settingService->updateHeroImage($data['image']);

        return response()->json([
            'message' => 'Gambar latar beranda berhasil diunggah.',
            'image_url' => $url,
        ]);
    }

    public function deleteHeroImage(): JsonResponse
    {
        $this->settingService->deleteHeroImage();

        return response()->json([
            'message' => 'Gambar latar beranda berhasil dihapus.',
        ]);
    }

    public function uploadPrincipalPhoto(Request $request): JsonResponse
    {
        $data = $request->validate([
            'photo' => ['required', 'image', 'max:5120'],
        ]);

        $url = $this->settingService->updatePrincipalPhoto($data['photo']);

        return response()->json([
            'message' => 'Foto profil berhasil diunggah.',
            'photo_url' => $url,
        ]);
    }

    public function deletePrincipalPhoto(): JsonResponse
    {
        $this->settingService->deletePrincipalPhoto();

        return response()->json([
            'message' => 'Foto profil berhasil dihapus.',
        ]);
    }

    public function uploadIntegrityImage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'max:5120'],
        ]);

        $url = $this->settingService->updateIntegrityImage($data['image']);

        return response()->json([
            'message' => 'Gambar Zona Integritas berhasil diunggah.',
            'image_url' => $url,
        ]);
    }

    public function deleteIntegrityImage(): JsonResponse
    {
        $this->settingService->deleteIntegrityImage();

        return response()->json([
            'message' => 'Gambar Zona Integritas berhasil dihapus.',
        ]);
    }

    public function uploadOrgChartImage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'max:8192'],
        ]);

        $url = $this->settingService->updateOrgChartImage($data['image']);

        return response()->json([
            'message' => 'Gambar struktur organisasi berhasil diunggah.',
            'image_url' => $url,
        ]);
    }

    public function deleteOrgChartImage(): JsonResponse
    {
        $this->settingService->deleteOrgChartImage();

        return response()->json([
            'message' => 'Gambar struktur organisasi berhasil dihapus.',
        ]);
    }
}
