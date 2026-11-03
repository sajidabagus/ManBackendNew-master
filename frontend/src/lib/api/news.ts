import { apiClient } from "./client";
import type { NewsCategory, NewsItem, PaginatedMeta } from "@/types/api";

export async function fetchNews(params?: {
  page?: number;
  status?: string;
  search?: string;
  category_id?: number;
}) {
  const { data } = await apiClient.get<{
    data: NewsItem[];
    meta: PaginatedMeta;
  }>("/news", { params });
  return data;
}

export async function fetchNewsItem(id: number) {
  const { data } = await apiClient.get<{ data: NewsItem }>(`/news/${id}`);
  return data.data;
}

export async function fetchNewsCategories() {
  const { data } = await apiClient.get<{ data: NewsCategory[] }>(
    "/news/categories"
  );
  return data.data;
}

export async function createNews(formData: FormData) {
  const { data } = await apiClient.post<{ data: NewsItem; message: string }>(
    "/news",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export async function updateNews(id: number, formData: FormData) {
  const { data } = await apiClient.put<{ data: NewsItem; message: string }>(
    `/news/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export async function deleteNews(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(`/news/${id}`);
  return data;
}
