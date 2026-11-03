import { apiClient } from "./client";
import type { ApiUser, PaginatedMeta } from "@/types/api";

export async function fetchUsers(params?: { page?: number; search?: string }) {
  const { data } = await apiClient.get<{
    data: ApiUser[];
    meta: PaginatedMeta;
  }>("/users", { params });
  return data;
}

export async function fetchRoles() {
  const { data } = await apiClient.get<{ data: string[] }>("/users/roles");
  return data.data;
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  is_active?: boolean;
}) {
  const { data } = await apiClient.post<{ data: ApiUser; message: string }>(
    "/users",
    payload
  );
  return data;
}

export async function updateUser(
  id: number,
  payload: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
    phone: string;
    is_active: boolean;
  }>
) {
  const { data } = await apiClient.put<{ data: ApiUser; message: string }>(
    `/users/${id}`,
    payload
  );
  return data;
}

export async function deleteUser(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(`/users/${id}`);
  return data;
}
