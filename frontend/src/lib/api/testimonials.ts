import { apiClient } from "./client";
import type { PaginatedMeta, TestimonialItem } from "@/types/api";

export async function fetchTestimonials(params?: { page?: number; search?: string }) {
  const { data } = await apiClient.get<{
    data: TestimonialItem[];
    meta: PaginatedMeta;
  }>("/testimonials", { params });
  return data;
}

export async function fetchTestimonial(id: number) {
  const { data } = await apiClient.get<{ data: TestimonialItem }>(`/testimonials/${id}`);
  return data.data;
}

export async function createTestimonial(formData: FormData) {
  const { data } = await apiClient.post<{ data: TestimonialItem; message: string }>(
    "/testimonials",
    formData,
  );
  return data;
}

export async function updateTestimonial(id: number, formData: FormData) {
  const { data } = await apiClient.put<{ data: TestimonialItem; message: string }>(
    `/testimonials/${id}`,
    formData,
  );
  return data;
}

export async function deleteTestimonial(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(`/testimonials/${id}`);
  return data;
}
