"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  fetchPublicComplaintStatus,
  getPublicApiErrorMessage,
  sendPublicComplaintMessage,
  trackPublicComplaint,
} from "@/lib/api/public-complaints";
import {
  readComplaintTrackingSession,
  storeComplaintTrackingSession,
} from "@/lib/complaint-session";
import { statusBadgeClass, statusLabels } from "@/lib/complaint-labels";
import type { PublicComplaint } from "@/types/complaints";

const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-teal-800 dark:bg-teal-950/50 dark:text-white";

export default function TrackComplaintPage() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [complaint, setComplaint] = useState<PublicComplaint | null>(null);
  const [sessionToken, setSessionToken] = useState("");
  const [reply, setReply] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const handleTrack = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    setComplaint(null);
    try {
      const existing = readComplaintTrackingSession(ticketNumber.trim());
      if (existing && !accessCode) {
        const data = await fetchPublicComplaintStatus(ticketNumber.trim(), existing.token);
        setSessionToken(existing.token);
        setComplaint(data);
        return;
      }

      const result = await trackPublicComplaint(ticketNumber.trim(), accessCode.trim());
      storeComplaintTrackingSession(
        ticketNumber.trim(),
        result.tracking_token,
        result.expires_at,
      );
      setSessionToken(result.tracking_token);
      setAccessCode("");
      setComplaint(result.complaint);
    } catch (err) {
      setError(getPublicApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!complaint || !sessionToken) return;
    setReplyMessage("");
    try {
      const updated = await sendPublicComplaintMessage(
        complaint.ticket_number,
        sessionToken,
        reply,
      );
      setComplaint(updated);
      setReply("");
      setReplyMessage("Balasan berhasil dikirim.");
    } catch (err) {
      setReplyMessage(getPublicApiErrorMessage(err));
    }
  };

  return (
    <div className="container-custom section-padding">
      <h1 className="font-display text-3xl font-bold text-secondary-dark dark:text-white">
        Cek Status Pengaduan
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-teal-200">
        Masukkan nomor tiket dan kode akses rahasia. Kode akses tidak disimpan di URL
        atau riwayat peramban.
      </p>

      <form
        onSubmit={handleTrack}
        className="mt-8 max-w-xl space-y-4 rounded-3xl bg-white p-6 shadow-soft dark:bg-teal-950/70"
        autoComplete="off"
      >
        <div>
          <label htmlFor="ticket" className="mb-1.5 block text-sm font-medium">
            Nomor tiket
          </label>
          <input
            id="ticket"
            className={fieldClass}
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="access" className="mb-1.5 block text-sm font-medium">
            Kode akses rahasia
          </label>
          <input
            id="access"
            type="password"
            className={fieldClass}
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Lihat status
        </Button>
      </form>

      {complaint && (
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft dark:bg-teal-950/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Nomor tiket</p>
              <p className="font-display text-xl font-bold">{complaint.ticket_number}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass[complaint.status]}`}
            >
              {complaint.status_label ?? statusLabels[complaint.status]}
            </span>
          </div>
          <h2 className="mt-4 text-lg font-semibold">{complaint.title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Dilaporkan{" "}
            {complaint.created_at
              ? new Date(complaint.created_at).toLocaleString("id-ID")
              : "—"}
          </p>

          <h3 className="mt-6 font-semibold">Timeline status</h3>
          <ol className="mt-3 space-y-3">
            {(complaint.timeline ?? []).length === 0 && (
              <li className="text-sm text-slate-500">Belum ada pembaruan.</li>
            )}
            {(complaint.timeline ?? []).map((item, index) => (
              <li key={`${item.created_at}-${index}`} className="border-l-2 border-primary/30 pl-4">
                <p className="text-sm font-semibold">{item.status_label ?? item.status}</p>
                {item.note && <p className="text-sm text-slate-600 dark:text-teal-200">{item.note}</p>}
                <p className="text-xs text-slate-400">
                  {item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : ""}
                </p>
              </li>
            ))}
          </ol>

          <h3 className="mt-6 font-semibold">Pembaruan untuk pelapor</h3>
          <div className="mt-3 space-y-3">
            {(complaint.messages ?? []).length === 0 && (
              <p className="text-sm text-slate-500">Belum ada tanggapan petugas.</p>
            )}
            {(complaint.messages ?? []).map((item, index) => (
              <div key={`${item.created_at}-${index}`} className="rounded-2xl bg-slate-50 p-4 dark:bg-teal-900/40">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {item.sender_type === "staff" ? "Petugas" : "Pelapor"}
                </p>
                <p className="mt-1 text-sm">{item.message}</p>
              </div>
            ))}
          </div>

          {complaint.needs_reporter_info && (
            <form onSubmit={handleReply} className="mt-6 space-y-3">
              <h3 className="font-semibold">Kirim informasi tambahan</h3>
              <textarea
                className={`${fieldClass} min-h-[120px]`}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                required
                minLength={5}
              />
              {replyMessage && <p className="text-sm text-primary">{replyMessage}</p>}
              <Button type="submit">Kirim balasan</Button>
            </form>
          )}
        </section>
      )}
    </div>
  );
}
