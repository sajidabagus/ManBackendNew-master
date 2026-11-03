import axios from "axios";
import { publicApiClient } from "./public-client";
import type {
  ComplaintCategory,
  ComplaintReceipt,
  PublicComplaint,
  TrackComplaintResponse,
} from "@/types/complaints";

export function getPublicApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") {
      return "Tidak dapat terhubung ke layanan. Silakan coba beberapa saat lagi.";
    }
    if (error.response?.status === 429) {
      return "Terlalu banyak percobaan. Silakan coba beberapa saat lagi.";
    }
    const errors = error.response?.data?.errors as Record<string, string[]> | undefined;
    const firstFieldError = errors ? Object.values(errors)[0]?.[0] : undefined;
    return (
      error.response?.data?.message ??
      firstFieldError ??
      "Terjadi kesalahan. Silakan periksa isian Anda."
    );
  }
  return "Terjadi kesalahan.";
}

export async function fetchPublicComplaintCategories(): Promise<ComplaintCategory[]> {
  const { data } = await publicApiClient.get<{ data: ComplaintCategory[] }>(
    "/public/complaint-categories",
  );
  return data.data;
}

export async function submitPublicComplaint(formData: FormData): Promise<ComplaintReceipt> {
  const { data } = await publicApiClient.post<{ data: ComplaintReceipt }>(
    "/public/complaints",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function trackPublicComplaint(
  ticketNumber: string,
  accessCode: string,
): Promise<TrackComplaintResponse> {
  const { data } = await publicApiClient.post<{ data: TrackComplaintResponse }>(
    "/public/complaints/track",
    {
      ticket_number: ticketNumber,
      access_code: accessCode,
    },
  );
  return data.data;
}

export async function fetchPublicComplaintStatus(
  ticketNumber: string,
  sessionToken: string,
): Promise<PublicComplaint> {
  const { data } = await publicApiClient.get<{ data: PublicComplaint }>(
    `/public/complaints/${encodeURIComponent(ticketNumber)}/status`,
    { headers: { "X-Complaint-Session": sessionToken } },
  );
  return data.data;
}

export async function sendPublicComplaintMessage(
  ticketNumber: string,
  sessionToken: string,
  message: string,
): Promise<PublicComplaint> {
  const { data } = await publicApiClient.post<{ data: PublicComplaint }>(
    `/public/complaints/${encodeURIComponent(ticketNumber)}/messages`,
    { message },
    { headers: { "X-Complaint-Session": sessionToken } },
  );
  return data.data;
}
