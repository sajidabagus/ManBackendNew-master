import { apiClient } from "./client";
import type { PaginatedMeta } from "@/types/api";
import type {
  AdminComplaintDetail,
  AdminComplaintListItem,
  ComplaintCategory,
  ComplaintDashboardStats,
  ComplaintPriority,
  ComplaintStatus,
} from "@/types/complaints";

export async function fetchComplaintDashboard() {
  const { data } = await apiClient.get<{ data: ComplaintDashboardStats }>(
    "/complaints/dashboard",
  );
  return data.data;
}

export async function fetchComplaints(params: {
  page?: number;
  search?: string;
  status?: string;
  category_id?: string;
  assigned_to?: string;
  from?: string;
  to?: string;
}) {
  const { data } = await apiClient.get<{
    data: AdminComplaintListItem[];
    meta: PaginatedMeta;
  }>("/complaints", { params });
  return data;
}

export async function fetchComplaint(id: number) {
  const { data } = await apiClient.get<{ data: AdminComplaintDetail }>(
    `/complaints/${id}`,
  );
  return data.data;
}

export async function updateComplaintStatus(
  id: number,
  payload: {
    status: ComplaintStatus;
    public_note?: string;
    internal_note?: string;
  },
) {
  const { data } = await apiClient.patch<{
    data: AdminComplaintDetail;
    message: string;
  }>(`/complaints/${id}/status`, payload);
  return data;
}

export async function assignComplaint(
  id: number,
  payload: { assigned_to?: number | null; priority?: ComplaintPriority },
) {
  const { data } = await apiClient.post<{
    data: AdminComplaintDetail;
    message: string;
  }>(`/complaints/${id}/assign`, payload);
  return data;
}

export async function addComplaintMessage(
  id: number,
  payload: { message: string; visibility: "public" | "internal" },
) {
  const { data } = await apiClient.post<{
    data: AdminComplaintDetail;
    message: string;
  }>(`/complaints/${id}/messages`, payload);
  return data;
}

export async function fetchAdminComplaintCategories(params?: {
  page?: number;
  search?: string;
}) {
  const { data } = await apiClient.get<{
    data: ComplaintCategory[];
    meta: PaginatedMeta;
  }>("/complaint-categories", { params });
  return data;
}

export async function createComplaintCategory(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<{
    data: ComplaintCategory;
    message: string;
  }>("/complaint-categories", payload);
  return data;
}

export async function updateComplaintCategory(
  id: number,
  payload: Record<string, unknown>,
) {
  const { data } = await apiClient.put<{
    data: ComplaintCategory;
    message: string;
  }>(`/complaint-categories/${id}`, payload);
  return data;
}

export async function deleteComplaintCategory(id: number) {
  const { data } = await apiClient.delete<{ message: string }>(
    `/complaint-categories/${id}`,
  );
  return data;
}

export async function downloadComplaintAttachment(
  complaintId: number,
  attachmentId: number,
  filename: string,
) {
  const { data } = await apiClient.get<Blob>(
    `/complaints/${complaintId}/attachments/${attachmentId}`,
    { responseType: "blob" },
  );
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportComplaints(params?: Record<string, string>) {
  const { data } = await apiClient.get<Blob>("/complaints/export", {
    params,
    responseType: "blob",
  });
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pengaduan-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
