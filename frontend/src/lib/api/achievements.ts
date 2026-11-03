import { apiClient } from "./client";
import type { AchievementItem, PaginatedMeta } from "@/types/api";

export async function fetchAchievements(params?: { page?: number; search?: string }) {
  const { data } = await apiClient.get<{
    data: AchievementItem[];
    meta: PaginatedMeta;
  }>("/achievements", { params });
  return data;
}

export async function fetchAchievement(id: number) {
  const { data } = await apiClient.get<{ data: AchievementItem }>(`/achievements/${id}`);
  return data.data;
}

export async function createAchievement(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<{ data: AchievementItem; message: string }>(
    "/achievements",
    payload,
  );
  return data;
}

export async function updateAchievement(id: number, payload: Record<string, unknown>) {
  const { data } = await apiClient.put<{ data: AchievementItem; message: string }>(
    `/achievements/${id}`,
    payload,
  );
  return data;
}

export async function deleteAchievement(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(`/achievements/${id}`);
  return data;
}
