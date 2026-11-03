import { apiClient } from "./client";
import type { GalleryItem, PaginatedMeta } from "@/types/api";

export async function fetchGalleries(params?: {
  page?: number;
  status?: string;
  search?: string;
}) {
  const { data } = await apiClient.get<{
    data: GalleryItem[];
    meta: PaginatedMeta;
  }>("/gallery", { params });
  return data;
}

export async function fetchGallery(id: number) {
  const { data } = await apiClient.get<{ data: GalleryItem }>(
    `/gallery/${id}`
  );
  return data.data;
}

export async function createGallery(formData: FormData) {
  const { data } = await apiClient.post<{ data: GalleryItem; message: string }>(
    "/gallery",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export async function updateGallery(id: number, formData: FormData) {
  const { data } = await apiClient.put<{ data: GalleryItem; message: string }>(
    `/gallery/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export async function deleteGallery(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(
    `/gallery/${id}`
  );
  return data;
}

export async function deleteGalleryImage(galleryId: number, imageId: number) {
  const { data } = await apiClient.delete<{ message: string }>(
    `/gallery/${galleryId}/images/${imageId}`
  );
  return data;
}
