import { apiClient } from "./client";
import type { PaginatedMeta, ServiceItem } from "@/types/api";

export async function fetchServices(params?: { page?: number; search?: string }) {
  const { data } = await apiClient.get<{
    data: ServiceItem[];
    meta: PaginatedMeta;
  }>("/services", { params });
  return data;
}

export async function fetchService(id: number) {
  const { data } = await apiClient.get<{ data: ServiceItem }>(`/services/${id}`);
  return data.data;
}

export async function createService(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<{ data: ServiceItem; message: string }>(
    "/services",
    payload
  );
  return data;
}

export async function updateService(id: number, payload: Record<string, unknown>) {
  const { data } = await apiClient.put<{ data: ServiceItem; message: string }>(
    `/services/${id}`,
    payload
  );
  return data;
}

export async function deleteService(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(`/services/${id}`);
  return data;
}
