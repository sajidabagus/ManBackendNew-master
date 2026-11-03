"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  addComplaintMessage,
  assignComplaint,
  downloadComplaintAttachment,
  fetchComplaint,
  updateComplaintStatus,
} from "@/lib/api/complaints";
import { fetchUsers } from "@/lib/api/users";
import { getApiErrorMessage } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { FormField, selectClass, textareaClass } from "@/components/admin/ui/FormField";
import {
  priorityLabels,
  reporterTypeLabels,
  statusBadgeClass,
  statusLabels,
} from "@/lib/complaint-labels";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiUser } from "@/types/api";
import type {
  AdminComplaintDetail,
  ComplaintPriority,
  ComplaintStatus,
} from "@/types/complaints";

export default function ComplaintDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canUpdate = permissions.includes("complaints.update");
  const canAssign = permissions.includes("complaints.assign");
  const canAttachments = permissions.includes("complaints.view_attachments");

  const [item, setItem] = useState<AdminComplaintDetail | null>(null);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<ComplaintStatus>("under_review");
  const [publicNote, setPublicNote] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<ComplaintPriority>("normal");
  const [reply, setReply] = useState("");
  const [visibility, setVisibility] = useState<"public" | "internal">("public");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!Number.isFinite(id)) return;
    setLoading(true);
    fetchComplaint(id)
      .then((data) => {
        setItem(data);
        setStatus((data.allowed_transitions?.[0] as ComplaintStatus) ?? data.status);
        setAssignedTo(data.assignee?.id ? String(data.assignee.id) : "");
        setPriority(data.priority);
        setError("");
      })
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
    fetchUsers({ page: 1 }).then((res) => setUsers(res.data)).catch(console.error);
  }, [load]);

  const run = async (fn: () => Promise<unknown>) => {
    setSaving(true);
    setMessage("");
    try {
      await fn();
      setMessage("Perubahan berhasil disimpan.");
      load();
    } catch (e) {
      setMessage(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Memuat pengaduan...
      </div>
    );
  }

  if (error) {
    return <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>;
  }

  if (!item) return null;

  return (
    <div>
      <PageHeader
        title={item.ticket_number}
        description={item.title}
        backHref="/admin/complaints"
      />

      {message && (
        <p className="mb-4 rounded-xl bg-primary/10 px-4 py-2 text-sm text-primary">{message}</p>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="space-y-4 xl:col-span-2">
          <Card title="Informasi laporan">
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <Item label="Status">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeClass[item.status]}`}>
                  {item.status_label ?? statusLabels[item.status]}
                </span>
              </Item>
              <Item label="Prioritas">{priorityLabels[item.priority]}</Item>
              <Item label="Kategori">{item.category?.name ?? "—"}</Item>
              <Item label="Jenis pelapor">{reporterTypeLabels[item.reporter_type]}</Item>
              <Item label="Mode identitas">
                {item.identity_mode === "anonymous" ? "Anonim" : "Menggunakan identitas"}
              </Item>
              <Item label="Tanggal masuk">
                {item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : "—"}
              </Item>
              <Item label="Tanggal kejadian">
                {item.incident_at ? new Date(item.incident_at).toLocaleString("id-ID") : "Tidak diketahui"}
              </Item>
              <Item label="Lokasi">{item.location || "—"}</Item>
            </dl>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Kronologi</p>
              <p className="mt-1 whitespace-pre-wrap text-sm">{item.description}</p>
            </div>
          </Card>

          <Card title="Identitas pelapor">
            {item.identity_restricted ? (
              <p className="text-sm text-amber-700">
                Identitas disembunyikan karena akun Anda tidak memiliki izin, atau laporan ini
                termasuk kategori sensitif.
              </p>
            ) : item.identity ? (
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                <Item label="Nama">{item.identity.name || "—"}</Item>
                <Item label="Email">{item.identity.email || "—"}</Item>
                <Item label="WhatsApp">{item.identity.phone || "—"}</Item>
                <Item label="Preferensi kontak">{item.identity.contact_preference || "—"}</Item>
              </dl>
            ) : (
              <p className="text-sm text-slate-500">Pelapor tidak menyertakan identitas.</p>
            )}
          </Card>

          <Card title="Lampiran">
            {!canAttachments ? (
              <p className="text-sm text-slate-500">Anda tidak memiliki izin unduh bukti.</p>
            ) : (item.attachments ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">Tidak ada lampiran.</p>
            ) : (
              <ul className="space-y-2">
                {item.attachments?.map((file) => (
                  <li key={file.id} className="flex items-center justify-between text-sm">
                    <span>
                      {file.original_name}{" "}
                      <span className="text-slate-400">({file.visibility})</span>
                    </span>
                    <button
                      type="button"
                      className="font-semibold text-primary"
                      onClick={() =>
                        downloadComplaintAttachment(item.id, file.id, file.original_name).catch(
                          (e) => alert(getApiErrorMessage(e)),
                        )
                      }
                    >
                      Unduh
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Percakapan">
            <div className="space-y-3">
              {(item.messages ?? []).map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-2xl p-3 text-sm ${
                    msg.visibility === "internal"
                      ? "border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
                      : "bg-slate-50 dark:bg-teal-900/40"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    {msg.sender_type === "staff" ? "Petugas" : "Pelapor"} ·{" "}
                    {msg.visibility === "internal" ? "Catatan internal" : "Untuk pelapor"}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>
            {canUpdate && (
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  run(async () => {
                    await addComplaintMessage(item.id, { message: reply, visibility });
                    setReply("");
                  });
                }}
              >
                <FormField label="Tambah pesan" required>
                  <textarea
                    className={textareaClass}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    required
                  />
                </FormField>
                <FormField label="Jenis pesan">
                  <select
                    className={selectClass}
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as "public" | "internal")}
                  >
                    <option value="public">Tanggapan untuk pelapor</option>
                    <option value="internal">Catatan internal</option>
                  </select>
                </FormField>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  Kirim pesan
                </button>
              </form>
            )}
          </Card>
        </section>

        <aside className="space-y-4">
          {canUpdate && (
            <Card title="Ubah status">
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  run(() =>
                    updateComplaintStatus(item.id, {
                      status,
                      public_note: publicNote || undefined,
                      internal_note: internalNote || undefined,
                    }),
                  );
                }}
              >
                <FormField label="Status tujuan" required>
                  <select
                    className={selectClass}
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                  >
                    {(item.allowed_transitions ?? []).map((value) => (
                      <option key={value} value={value}>
                        {statusLabels[value]}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Pembaruan untuk pelapor">
                  <textarea className={textareaClass} value={publicNote} onChange={(e) => setPublicNote(e.target.value)} />
                </FormField>
                <FormField label="Catatan internal">
                  <textarea className={textareaClass} value={internalNote} onChange={(e) => setInternalNote(e.target.value)} />
                </FormField>
                <button
                  type="submit"
                  disabled={saving || (item.allowed_transitions ?? []).length === 0}
                  className="w-full rounded-2xl bg-primary py-2 text-sm font-semibold text-white"
                >
                  Simpan status
                </button>
              </form>
            </Card>
          )}

          {canAssign && (
            <Card title="Penugasan petugas">
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  run(() =>
                    assignComplaint(item.id, {
                      assigned_to: assignedTo ? Number(assignedTo) : null,
                      priority,
                    }),
                  );
                }}
              >
                <FormField label="Petugas">
                  <select
                    className={selectClass}
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="">Belum ditugaskan</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Prioritas">
                  <select
                    className={selectClass}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </FormField>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-2xl bg-primary py-2 text-sm font-semibold text-white"
                >
                  Simpan penugasan
                </button>
              </form>
            </Card>
          )}

          <Card title="Timeline status">
            <ol className="space-y-3 text-sm">
              {(item.status_histories ?? []).map((row, index) => (
                <li key={`${row.created_at}-${index}`}>
                  <p className="font-semibold">
                    {row.new_status ? statusLabels[row.new_status as ComplaintStatus] ?? row.new_status : ""}
                    {row.visibility === "internal" ? " · internal" : ""}
                  </p>
                  {row.note && <p className="text-slate-600 dark:text-teal-200">{row.note}</p>}
                  <p className="text-xs text-slate-400">
                    {row.changed_by ?? "Sistem"} ·{" "}
                    {row.created_at ? new Date(row.created_at).toLocaleString("id-ID") : ""}
                  </p>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Riwayat aktivitas">
            <ul className="space-y-2 text-xs">
              {(item.audit_logs ?? []).map((log, index) => (
                <li key={`${log.created_at}-${index}`}>
                  <span className="font-semibold">{log.action}</span> · {log.actor ?? "Sistem"}
                  <div className="text-slate-400">
                    {log.created_at ? new Date(log.created_at).toLocaleString("id-ID") : ""}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-teal-800/50 dark:bg-teal-950/40">
      <h2 className="mb-3 font-display text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 font-medium">{children}</dd>
    </div>
  );
}
