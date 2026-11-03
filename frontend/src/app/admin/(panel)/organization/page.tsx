"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import {
  deleteOrgChartImage,
  fetchSettings,
  updateSettings,
  uploadOrgChartImage,
} from "@/lib/api/settings";
import { getApiErrorMessage } from "@/lib/api/client";
import { normalizeMediaUrl } from "@/lib/media-url";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { FormField, inputClass } from "@/components/admin/ui/FormField";
import { ImageDropzone } from "@/components/admin/ui/ImageDropzone";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";

export default function OrganizationAdminPage() {
  const [title, setTitle] = useState("Struktur Organisasi");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings()
      .then((res) => {
        res.data.forEach((s) => {
          if (s.key === "org_chart_image") {
            setImageUrl(normalizeMediaUrl(s.url) ?? null);
          }
          if (s.key === "org_chart_title") {
            setTitle(s.value ?? "Struktur Organisasi");
          }
        });
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
      const res = await uploadOrgChartImage(file);
      setImageUrl(normalizeMediaUrl(res.image_url) ?? res.image_url);
      setImageFiles([]);
      setMessage("Gambar struktur organisasi berhasil diunggah.");
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
      await deleteOrgChartImage();
      setImageUrl(null);
      setImageFiles([]);
      setMessage("Gambar struktur organisasi berhasil dihapus.");
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
      await updateSettings({ org_chart_title: title });
      setMessage("Judul struktur organisasi berhasil disimpan.");
    } catch (e) {
      setMessage(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <TableSkeleton rows={6} />;

  return (
    <div>
      <PageHeader
        title="Struktur Organisasi"
        description="Unggah dan atur gambar bagan struktur organisasi yang tampil di website publik."
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
            Simpan judul
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
          <FormField label="Judul halaman">
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormField>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
          <h2 className="mb-1 font-display text-lg font-semibold text-secondary-dark dark:text-white">
            Gambar Bagan
          </h2>
          <p className="mb-4 text-sm text-slate-500 dark:text-teal-400">
            Gambar tampil di menu Profil → Struktur Organisasi. Rekomendasi:
            PNG/JPG landscape, maksimal 8 MB.
          </p>
          <div className="max-w-xl">
            <ImageDropzone
              inputId="org-chart-image-upload"
              label="Unggah gambar struktur organisasi"
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
      </div>
    </div>
  );
}
