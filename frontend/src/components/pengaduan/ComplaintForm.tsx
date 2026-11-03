"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  fetchPublicComplaintCategories,
  getPublicApiErrorMessage,
  submitPublicComplaint,
} from "@/lib/api/public-complaints";
import { storeComplaintReceipt } from "@/lib/complaint-session";
import { Button } from "@/components/ui/Button";
import type { ComplaintCategory } from "@/types/complaints";

const schema = z
  .object({
    reporter_type: z.enum(["siswa", "orang_tua", "guru_tendik", "masyarakat"]),
    identity_mode: z.enum(["identified", "anonymous"]),
    name: z.string().max(150).optional().or(z.literal("")),
    email: z.string().email("Format email tidak valid.").optional().or(z.literal("")),
    phone: z.string().max(20).optional().or(z.literal("")),
    category_id: z.string().min(1, "Kategori wajib dipilih."),
    title: z.string().min(8, "Judul minimal 8 karakter.").max(200),
    description: z.string().min(20, "Kronologi minimal 20 karakter.").max(8000),
    incident_at: z.string().optional(),
    location: z.string().max(255).optional(),
    privacy_accepted: z.boolean().refine((v) => v, {
      message: "Anda harus menyetujui pemberitahuan privasi.",
    }),
  })
  .superRefine((values, ctx) => {
    if (values.identity_mode === "identified" && !values.name?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Nama wajib diisi jika tidak memilih mode anonim.",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-teal-800 dark:bg-teal-950/50 dark:text-white";

export function ComplaintForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      reporter_type: "masyarakat",
      identity_mode: "identified",
      privacy_accepted: false,
    },
  });

  const identityMode = watch("identity_mode");

  useEffect(() => {
    fetchPublicComplaintCategories().then(setCategories).catch(() => {
      setFormError("Kategori pengaduan gagal dimuat. Muat ulang halaman.");
    });
  }, []);

  const onValid = () => setConfirmOpen(true);

  const submitConfirmed = async () => {
    setFormError("");
    const values = getValues();
    const fd = new FormData();
    fd.append("reporter_type", values.reporter_type);
    fd.append("identity_mode", values.identity_mode);
    fd.append("category_id", values.category_id);
    fd.append("title", values.title);
    fd.append("description", values.description);
    fd.append("privacy_accepted", "1");
    if (values.name) fd.append("name", values.name);
    if (values.email) fd.append("email", values.email);
    if (values.phone) fd.append("phone", values.phone);
    if (values.incident_at) fd.append("incident_at", values.incident_at);
    if (values.location) fd.append("location", values.location);
    files.forEach((file) => fd.append("attachments[]", file));

    setSending(true);
    try {
      const receipt = await submitPublicComplaint(fd);
      storeComplaintReceipt(receipt);
      setConfirmOpen(false);
      router.push("/pengaduan/hasil");
    } catch (error) {
      setConfirmOpen(false);
      setFormError(getPublicApiErrorMessage(error));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onValid)} className="space-y-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Jenis pelapor" error={errors.reporter_type?.message} required>
            <select className={fieldClass} {...register("reporter_type")}>
              <option value="siswa">Siswa</option>
              <option value="orang_tua">Orang tua / wali</option>
              <option value="guru_tendik">Guru / tenaga kependidikan</option>
              <option value="masyarakat">Masyarakat</option>
            </select>
          </Field>
          <Field label="Mode identitas" error={errors.identity_mode?.message} required>
            <select className={fieldClass} {...register("identity_mode")}>
              <option value="identified">Menggunakan identitas</option>
              <option value="anonymous">Anonim</option>
            </select>
          </Field>
        </div>

        {identityMode === "anonymous" && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            Mode anonim tidak mewajibkan nama. Sistem tetap menyimpan metadata teknis terbatas
            (misalnya waktu pengiriman) yang diperlukan untuk keamanan layanan, sehingga
            anonimitas tidak bersifat mutlak.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nama pelapor"
            error={errors.name?.message}
            required={identityMode === "identified"}
          >
            <input className={fieldClass} {...register("name")} autoComplete="name" />
          </Field>
          <Field label="Email (opsional)" error={errors.email?.message}>
            <input type="email" className={fieldClass} {...register("email")} autoComplete="email" />
          </Field>
          <Field label="Nomor WhatsApp (opsional)" error={errors.phone?.message}>
            <input className={fieldClass} {...register("phone")} inputMode="tel" autoComplete="tel" />
          </Field>
          <Field label="Kategori pengaduan" error={errors.category_id?.message} required>
            <select className={fieldClass} {...register("category_id")}>
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Judul pengaduan" error={errors.title?.message} required>
          <input className={fieldClass} {...register("title")} />
        </Field>
        <Field label="Kronologi / deskripsi lengkap" error={errors.description?.message} required>
          <textarea className={`${fieldClass} min-h-[160px]`} {...register("description")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tanggal kejadian (jika diketahui)" error={errors.incident_at?.message}>
            <input type="datetime-local" className={fieldClass} {...register("incident_at")} />
          </Field>
          <Field label="Lokasi kejadian (jika relevan)" error={errors.location?.message}>
            <input className={fieldClass} {...register("location")} />
          </Field>
        </div>

        <Field label="Lampiran foto atau dokumen (opsional, maks. 3 berkas, 5 MB)">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            multiple
            className={fieldClass}
            onChange={(event) => {
              const selected = Array.from(event.target.files ?? []).slice(0, 3);
              setFiles(selected);
            }}
          />
        </Field>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm dark:border-teal-800">
          <input type="checkbox" className="mt-1" {...register("privacy_accepted")} />
          <span>
            Saya memahami bahwa laporan dapat berisi data sensitif, akan ditindaklanjuti oleh
            petugas yang berwenang, dan kode akses harus saya simpan sendiri. Saya menyetujui
            pemberitahuan privasi layanan pengaduan MAN 2 Kota Madiun.
          </span>
        </label>
        {errors.privacy_accepted && (
          <p className="text-xs text-red-500">{errors.privacy_accepted.message}</p>
        )}

        {formError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</p>
        )}

        <Button type="submit" disabled={sending}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Kirim Pengaduan
        </Button>
      </form>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-teal-950">
            <h3 className="font-display text-lg font-semibold text-secondary-dark dark:text-white">
              Konfirmasi pengiriman
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-teal-200">
              Pastikan kronologi sudah lengkap. Setelah dikirim, kode akses hanya ditampilkan sekali.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={sending}>
                Periksa kembali
              </Button>
              <Button onClick={submitConfirmed} disabled={sending}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Ya, kirim
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-teal-200">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
