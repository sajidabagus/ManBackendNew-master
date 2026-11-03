"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import {
  deleteHeroImage,
  deletePrincipalPhoto,
  deleteSchoolLogo,
  fetchSettings,
  updateSettings,
  uploadHeroImage,
  uploadPrincipalPhoto,
  uploadSchoolLogo,
} from "@/lib/api/settings";
import { getApiErrorMessage } from "@/lib/api/client";
import { normalizeMediaUrl } from "@/lib/media-url";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { FormField, inputClass, textareaClass } from "@/components/admin/ui/FormField";
import { ImageDropzone } from "@/components/admin/ui/ImageDropzone";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";

const groups: { key: string; label: string; fields: { key: string; label: string; multiline?: boolean }[] }[] = [
  {
    key: "general",
    label: "Informasi Umum",
    fields: [
      { key: "school_name", label: "Nama Sekolah" },
      { key: "school_tagline", label: "Tagline" },
      { key: "school_address", label: "Alamat", multiline: true },
      { key: "school_phone", label: "Telepon" },
      { key: "school_email", label: "Email" },
      { key: "school_hours", label: "Jam Operasional" },
    ],
  },
  {
    key: "profile",
    label: "Profil Kepala Madrasah",
    fields: [
      { key: "principal_name", label: "Nama Kepala Madrasah" },
      { key: "principal_title", label: "Jabatan" },
      { key: "principal_greeting", label: "Sambutan", multiline: true },
      { key: "school_vision", label: "Visi", multiline: true },
      { key: "school_mission", label: "Misi (satu baris per poin)", multiline: true },
      { key: "school_accreditation", label: "Akreditasi" },
    ],
  },
  {
    key: "stats",
    label: "Statistik Landing Page",
    fields: [
      { key: "total_students", label: "Total Siswa" },
      { key: "total_teachers", label: "Total Guru" },
      { key: "total_prestasi", label: "Total Prestasi" },
      { key: "total_ruang", label: "Total Ruang Kelas" },
    ],
  },
  {
    key: "social",
    label: "Media Sosial",
    fields: [
      { key: "instagram_url", label: "Instagram URL" },
      { key: "youtube_url", label: "YouTube URL" },
      { key: "facebook_url", label: "Facebook URL" },
      { key: "tiktok_url", label: "TikTok URL" },
    ],
  },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const [logoUploading, setLogoUploading] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroImageFiles, setHeroImageFiles] = useState<File[]>([]);
  const [heroImageUploading, setHeroImageUploading] = useState(false);
  const [principalPhotoUrl, setPrincipalPhotoUrl] = useState<string | null>(null);
  const [principalPhotoFiles, setPrincipalPhotoFiles] = useState<File[]>([]);
  const [principalPhotoUploading, setPrincipalPhotoUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings()
      .then((res) => {
        const map: Record<string, string> = {};
        res.data.forEach((s) => {
          if (s.key === "school_logo") {
            setLogoUrl(normalizeMediaUrl(s.url) ?? null);
            return;
          }
          if (s.key === "hero_image") {
            setHeroImageUrl(normalizeMediaUrl(s.url) ?? null);
            return;
          }
          if (s.key === "principal_photo") {
            setPrincipalPhotoUrl(normalizeMediaUrl(s.url) ?? null);
            return;
          }
          map[s.key] = s.value ?? "";
        });
        setValues(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogoUpload = async (files: File[]) => {
    setLogoFiles(files);
    const file = files[0];
    if (!file) return;

    setLogoUploading(true);
    setMessage("");
    try {
      const res = await uploadSchoolLogo(file);
      setLogoUrl(normalizeMediaUrl(res.logo_url) ?? res.logo_url);
      setLogoFiles([]);
      setMessage("Logo berhasil diunggah.");
    } catch (e) {
      setMessage(getApiErrorMessage(e));
      setLogoFiles([]);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoDelete = async () => {
    setLogoUploading(true);
    setMessage("");
    try {
      await deleteSchoolLogo();
      setLogoUrl(null);
      setLogoFiles([]);
      setMessage("Logo berhasil dihapus.");
    } catch (e) {
      setMessage(getApiErrorMessage(e));
    } finally {
      setLogoUploading(false);
    }
  };

  const handleHeroImageUpload = async (files: File[]) => {
    setHeroImageFiles(files);
    const file = files[0];
    if (!file) return;

    setHeroImageUploading(true);
    setMessage("");
    try {
      const res = await uploadHeroImage(file);
      setHeroImageUrl(normalizeMediaUrl(res.image_url) ?? res.image_url);
      setHeroImageFiles([]);
      setMessage("Gambar latar beranda berhasil diunggah.");
    } catch (e) {
      setMessage(getApiErrorMessage(e));
      setHeroImageFiles([]);
    } finally {
      setHeroImageUploading(false);
    }
  };

  const handleHeroImageDelete = async () => {
    setHeroImageUploading(true);
    setMessage("");
    try {
      await deleteHeroImage();
      setHeroImageUrl(null);
      setHeroImageFiles([]);
      setMessage("Gambar latar beranda berhasil dihapus. Beranda kembali ke gambar default.");
    } catch (e) {
      setMessage(getApiErrorMessage(e));
    } finally {
      setHeroImageUploading(false);
    }
  };

  const handlePrincipalPhotoUpload = async (files: File[]) => {
    setPrincipalPhotoFiles(files);
    const file = files[0];
    if (!file) return;

    setPrincipalPhotoUploading(true);
    setMessage("");
    try {
      const res = await uploadPrincipalPhoto(file);
      setPrincipalPhotoUrl(normalizeMediaUrl(res.photo_url) ?? res.photo_url);
      setPrincipalPhotoFiles([]);
      setMessage("Foto profil berhasil diunggah.");
    } catch (e) {
      setMessage(getApiErrorMessage(e));
      setPrincipalPhotoFiles([]);
    } finally {
      setPrincipalPhotoUploading(false);
    }
  };

  const handlePrincipalPhotoDelete = async () => {
    setPrincipalPhotoUploading(true);
    setMessage("");
    try {
      await deletePrincipalPhoto();
      setPrincipalPhotoUrl(null);
      setPrincipalPhotoFiles([]);
      setMessage("Foto profil berhasil dihapus.");
    } catch (e) {
      setMessage(getApiErrorMessage(e));
    } finally {
      setPrincipalPhotoUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateSettings(values);
      setMessage("Pengaturan berhasil disimpan.");
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
        title="Pengaturan Website"
        description="Kelola informasi sekolah, profil, dan media sosial"
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
            Simpan Semua
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
            Logo Navbar
          </h2>
          <p className="mb-4 text-sm text-slate-500 dark:text-teal-400">
            Logo tampil di navbar website publik, di samping nama sekolah.
            Rekomendasi: PNG transparan, minimal 128×128 px.
          </p>
          <div className="max-w-md">
            <ImageDropzone
              inputId="school-logo-upload"
              label="Unggah logo sekolah"
              value={logoFiles}
              previews={logoUrl && logoFiles.length === 0 ? [logoUrl] : []}
              onChange={handleLogoUpload}
            />
            {logoUrl && (
              <button
                type="button"
                onClick={handleLogoDelete}
                disabled={logoUploading}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                {logoUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Hapus logo
              </button>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
          <h2 className="mb-1 font-display text-lg font-semibold text-secondary-dark dark:text-white">
            Gambar Latar Beranda
          </h2>
          <p className="mb-4 text-sm text-slate-500 dark:text-teal-400">
            Foto tampil sebagai latar belakang section utama halaman beranda.
            Rekomendasi: landscape 16:9 atau 21:9, minimal 1920×1080 px, maksimal
            8 MB. Jika dihapus, beranda memakai gambar default.
          </p>
          <div className="max-w-xl">
            <ImageDropzone
              inputId="hero-image-upload"
              label="Unggah gambar latar beranda"
              value={heroImageFiles}
              previews={
                heroImageUrl && heroImageFiles.length === 0 ? [heroImageUrl] : []
              }
              onChange={handleHeroImageUpload}
            />
            {heroImageUrl && (
              <button
                type="button"
                onClick={handleHeroImageDelete}
                disabled={heroImageUploading}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                {heroImageUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Hapus gambar latar
              </button>
            )}
          </div>
        </section>

        {groups.map((group) => (
          <section
            key={group.key}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40"
          >
            <h2 className="mb-4 font-display text-lg font-semibold text-secondary-dark dark:text-white">
              {group.label}
            </h2>
            {group.key === "profile" && (
              <div className="mb-6 max-w-md">
                <p className="mb-3 text-sm font-medium text-slate-700 dark:text-teal-200">
                  Foto Kepala Madrasah
                </p>
                <p className="mb-3 text-sm text-slate-500 dark:text-teal-400">
                  Foto tampil di section Sambutan Kepala Madrasah. Rekomendasi:
                  potret vertikal 4:5, minimal 400×500 px.
                </p>
                <ImageDropzone
                  inputId="principal-photo-upload"
                  label="Unggah foto profil"
                  value={principalPhotoFiles}
                  previews={
                    principalPhotoUrl && principalPhotoFiles.length === 0
                      ? [principalPhotoUrl]
                      : []
                  }
                  onChange={handlePrincipalPhotoUpload}
                />
                {principalPhotoUrl && (
                  <button
                    type="button"
                    onClick={handlePrincipalPhotoDelete}
                    disabled={principalPhotoUploading}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    {principalPhotoUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Hapus foto
                  </button>
                )}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => (
                <FormField
                  key={field.key}
                  label={field.label}
                  className={field.multiline ? "sm:col-span-2" : ""}
                >
                  {field.multiline ? (
                    <textarea
                      className={textareaClass}
                      rows={3}
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
        ))}
      </div>
    </div>
  );
}
