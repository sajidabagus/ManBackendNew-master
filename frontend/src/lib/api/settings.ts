import { apiClient } from "./client";
import type { SettingsResponse } from "@/types/api";

export async function fetchSettings() {
  const { data } = await apiClient.get<SettingsResponse>("/settings");
  return data;
}

export async function updateSettings(settings: Record<string, string>) {
  const { data } = await apiClient.put<SettingsResponse>("/settings", {
    settings,
  });
  return data;
}

export async function uploadSchoolLogo(file: File) {
  const formData = new FormData();
  formData.append("logo", file);
  const { data } = await apiClient.post<{ message: string; logo_url: string }>(
    "/settings/logo",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteSchoolLogo() {
  const { data } = await apiClient.delete<{ message: string }>("/settings/logo");
  return data;
}

export async function uploadHeroImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await apiClient.post<{ message: string; image_url: string }>(
    "/settings/hero-image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteHeroImage() {
  const { data } = await apiClient.delete<{ message: string }>(
    "/settings/hero-image",
  );
  return data;
}

export async function uploadPrincipalPhoto(file: File) {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await apiClient.post<{ message: string; photo_url: string }>(
    "/settings/principal-photo",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deletePrincipalPhoto() {
  const { data } = await apiClient.delete<{ message: string }>(
    "/settings/principal-photo",
  );
  return data;
}

export async function uploadIntegrityImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await apiClient.post<{ message: string; image_url: string }>(
    "/settings/integrity-image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteIntegrityImage() {
  const { data } = await apiClient.delete<{ message: string }>(
    "/settings/integrity-image",
  );
  return data;
}

export async function uploadOrgChartImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await apiClient.post<{ message: string; image_url: string }>(
    "/settings/org-chart-image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteOrgChartImage() {
  const { data } = await apiClient.delete<{ message: string }>(
    "/settings/org-chart-image",
  );
  return data;
}
