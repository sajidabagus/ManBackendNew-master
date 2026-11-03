import { apiClient } from "./client";
import type { FaqItem, PaginatedMeta } from "@/types/api";

export async function fetchFaqs(params?: { page?: number; search?: string }) {
  const { data } = await apiClient.get<{
    data: FaqItem[];
    meta: PaginatedMeta;
  }>("/faqs", { params });
  return data;
}

export async function fetchFaq(id: number) {
  const { data } = await apiClient.get<{ data: FaqItem }>(`/faqs/${id}`);
  return data.data;
}

export async function createFaq(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<{ data: FaqItem; message: string }>(
    "/faqs",
    payload,
  );
  return data;
}

export async function updateFaq(id: number, payload: Record<string, unknown>) {
  const { data } = await apiClient.put<{ data: FaqItem; message: string }>(
    `/faqs/${id}`,
    payload,
  );
  return data;
}

export async function deleteFaq(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(`/faqs/${id}`);
  return data;
}
