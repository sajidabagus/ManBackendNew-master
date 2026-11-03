import type { ComplaintReceipt } from "@/types/complaints";

const RECEIPT_KEY = "man2_complaint_receipt";
const SESSION_PREFIX = "man2_complaint_session:";

export function storeComplaintReceipt(receipt: ComplaintReceipt): void {
  sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
}

export function readComplaintReceipt(): ComplaintReceipt | null {
  const raw = sessionStorage.getItem(RECEIPT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ComplaintReceipt;
  } catch {
    return null;
  }
}

export function storeComplaintTrackingSession(
  ticketNumber: string,
  token: string,
  expiresAt: string,
): void {
  sessionStorage.setItem(
    SESSION_PREFIX + ticketNumber,
    JSON.stringify({ token, expiresAt }),
  );
}

export function readComplaintTrackingSession(
  ticketNumber: string,
): { token: string; expiresAt: string } | null {
  const raw = sessionStorage.getItem(SESSION_PREFIX + ticketNumber);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { token: string; expiresAt: string };
    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
      sessionStorage.removeItem(SESSION_PREFIX + ticketNumber);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
