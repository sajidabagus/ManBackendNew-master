import { apiClient } from "./client";
import type { NewsCategory } from "@/types/api";

export async function fetchCategories(all = true) {
  const { data } = await apiClient.get<{ data: NewsCategory[] }>(
    "/news/categories",
    { params: all ? {} : { active_only: 1 } }
  );
  return data.data;
}

export async function createCategory(payload: {
  name: string;
  description?: string;
  is_active?: boolean;
}) {
  const { data } = await apiClient.post<{ data: NewsCategory; message: string }>(
    "/news/categories",
    payload
  );
  return data;
}

export async function updateCategory(
  id: number,
  payload: Partial<{ name: string; description: string; is_active: boolean }>
) {
  const { data } = await apiClient.put<{ data: NewsCategory; message: string }>(
    `/news/categories/${id}`,
    payload
  );
  return data;
}

export async function deleteCategory(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(
    `/news/categories/${id}`
  );
  return data;
}
