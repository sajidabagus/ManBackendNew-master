"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import {
  deleteIntegrityImage,
  fetchSettings,
  updateSettings,
  uploadIntegrityImage,
} from "@/lib/api/settings";
import { getApiErrorMessage } from "@/lib/api/client";
import { normalizeMediaUrl } from "@/lib/media-url";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { FormField, inputClass, textareaClass } from "@/components/admin/ui/FormField";
import { ImageDropzone } from "@/components/admin/ui/ImageDropzone";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";

const settingKeys = [
  "integrity_badge",
  "integrity_title",
  "integrity_subtitle",
  "integrity_description",
  "integrity_commitments",
  "integrity_contact_label",
  "integrity_contact_email",
  "integrity_contact_phone",
] as const;

const fields: {
  key: (typeof settingKeys)[number];
  label: string;
  multiline?: boolean;
  hint?: string;
}[] = [
  { key: "integrity_badge", label: "Badge" },
  { key: "integrity_title", label: "Judul Section" },
  { key: "integrity_subtitle", label: "Subjudul", multiline: true },
  { key: "integrity_description", label: "Deskripsi", multiline: true },
  {
    key: "integrity_commitments",
    label: "Poin Komitmen",
    multiline: true,
    hint: "Satu poin per baris",
  },
  { key: "integrity_contact_label", label: "Label Kontak Laporan" },
  { key: "integrity_contact_email", label: "Email Laporan" },
  { key: "integrity_contact_phone", label: "Telepon Laporan" },
];

export default function IntegrityZoneAdminPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings()
      .then((res) => {
        const map: Record<string, string> = {};
        res.data.forEach((s) => {
          if (s.key === "integrity_image") {
            setImageUrl(normalizeMediaUrl(s.url) ?? null);
            return;
          }
          if (settingKeys.includes(s.key as (typeof settingKeys)[number])) {
            map[s.key] = s.value ?? "";
          }
        });
        setValues(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (files: File[]) => {
    setImageFiles(files);
    const file = files[0];
    if (!file) return;

    setImageUploading(true);
    setMessage("");
    try {
      const res = await uploadIntegrityImage(file);
      setImageUrl(normalizeMediaUrl(res.image_url) ?? res.image_url);
      setImageFiles([]);
      setMessage("Gambar berhasil diunggah.");
    } catch (e) {
      setMessage(getApiErrorMessage(e));
      setImageFiles([]);
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageDelete = async () => {
    setImageUploading(true);
    setMessage("");
    try {
      await deleteIntegrityImage();
      setImageUrl(null);
      setImageFiles([]);
      setMessage("Gambar berhasil dihapus.");
    } catch (e) {
      setMessage(getApiErrorMessage(e));
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateSettings(values);
      setMessage("Konten Zona Integritas berhasil disimpan.");
    } catch (e) {
      setMessage(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <TableSkeleton rows={8} />;

  return (
    <div>
      <PageHeader
        title="Zona Integritas"
        description="Kelola konten section Zona Integritas di landing page"
        action={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Simpan
          </button>
        }
      />

      {message && (
        <p
          className={`mb-4 rounded-xl px-4 py-2 text-sm ${
            message.includes("berhasil")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
          <h2 className="mb-1 font-display text-lg font-semibold text-secondary-dark dark:text-white">
            Gambar Section
          </h2>
          <p className="mb-4 text-sm text-slate-500 dark:text-teal-400">
            Opsional. Banner atau infografis Zona Integritas.
          </p>
          <div className="max-w-md">
            <ImageDropzone
              inputId="integrity-image-upload"
              label="Unggah gambar Zona Integritas"
              value={imageFiles}
              previews={imageUrl && imageFiles.length === 0 ? [imageUrl] : []}
              onChange={handleImageUpload}
            />
            {imageUrl && (
              <button
                type="button"
                onClick={handleImageDelete}
                disabled={imageUploading}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                {imageUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Hapus gambar
              </button>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
          <h2 className="mb-4 font-display text-lg font-semibold text-secondary-dark dark:text-white">
            Konten Teks
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <FormField
                key={field.key}
                label={field.label}
                className={field.multiline ? "sm:col-span-2" : ""}
              >
                {field.multiline ? (
                  <textarea
                    className={textareaClass}
                    rows={field.key === "integrity_commitments" ? 8 : 3}
                    placeholder={field.hint}
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                  />
                )}
              </FormField>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
