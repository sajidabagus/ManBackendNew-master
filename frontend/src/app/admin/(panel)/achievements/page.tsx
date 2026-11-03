"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Pencil, Save, Trash2 } from "lucide-react";
import { AdminSearchInput } from "@/components/admin/ui/AdminSearchInput";
import {
  deleteAchievement,
  fetchAchievements,
} from "@/lib/api/achievements";
import { fetchSettings, updateSettings } from "@/lib/api/settings";
import { getApiErrorMessage } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { FormField, inputClass, textareaClass } from "@/components/admin/ui/FormField";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import { Pagination } from "@/components/admin/ui/Pagination";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import type { AchievementItem, PaginatedMeta } from "@/types/api";

const sectionKeys = [
  "achievements_badge",
  "achievements_title",
  "achievements_subtitle",
  "achievements_counter_1_value",
  "achievements_counter_1_label",
  "achievements_counter_2_value",
  "achievements_counter_2_label",
  "achievements_counter_3_value",
  "achievements_counter_3_label",
] as const;

export default function AchievementsPage() {
  const [items, setItems] = useState<AchievementItem[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sectionValues, setSectionValues] = useState<Record<string, string>>({});
  const [sectionSaving, setSectionSaving] = useState(false);
  const [sectionMessage, setSectionMessage] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadItems = useCallback(() => {
    setLoading(true);
    fetchAchievements({ page, search: search || undefined })
      .then((res) => {
        setItems(res.data);
        setMeta(res.meta);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(loadItems, 300);
    return () => clearTimeout(t);
  }, [loadItems]);

  useEffect(() => {
    fetchSettings()
      .then((res) => {
        const map: Record<string, string> = {};
        res.data.forEach((s) => {
          if (sectionKeys.includes(s.key as (typeof sectionKeys)[number])) {
            map[s.key] = s.value ?? "";
          }
        });
        setSectionValues(map);
      })
      .catch(console.error);
  }, []);

  const handleSaveSection = async () => {
    setSectionSaving(true);
    setSectionMessage("");
    try {
      await updateSettings(sectionValues);
      setSectionMessage("Pengaturan section berhasil disimpan.");
    } catch (e) {
      setSectionMessage(getApiErrorMessage(e));
    } finally {
      setSectionSaving(false);
    }
  };

  const columns: Column<AchievementItem>[] = [
    { key: "title", header: "Prestasi", render: (r) => r.title },
    { key: "level", header: "Kategori", render: (r) => r.level },
    { key: "year", header: "Tahun", render: (r) => r.year },
    { key: "order", header: "Urutan", render: (r) => r.sort_order },
    {
      key: "status",
      header: "Status",
      render: (r) => (r.is_active ? "Aktif" : "Nonaktif"),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (r) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/achievements/${r.id}/edit`}
            className="rounded-lg p-2 text-primary hover:bg-primary/10"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(r.id)}
            className="rounded-lg p-2 text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Prestasi Sekolah"
        description="Kelola section prestasi di landing page"
        action={
          <Link
            href="/admin/achievements/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Tambah Prestasi
          </Link>
        }
      />

      <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-secondary-dark dark:text-white">
              Pengaturan Section
            </h2>
            <p className="text-sm text-slate-500 dark:text-teal-400">
              Judul, deskripsi, dan statistik ringkas di atas carousel.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveSection}
            disabled={sectionSaving}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            {sectionSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Simpan Section
          </button>
        </div>

        {sectionMessage && (
          <p
            className={`mb-4 rounded-xl px-4 py-2 text-sm ${
              sectionMessage.includes("berhasil")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {sectionMessage}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Badge">
            <input
              className={inputClass}
              value={sectionValues.achievements_badge ?? ""}
              onChange={(e) =>
                setSectionValues((v) => ({ ...v, achievements_badge: e.target.value }))
              }
            />
          </FormField>
          <FormField label="Judul Section">
            <input
              className={inputClass}
              value={sectionValues.achievements_title ?? ""}
              onChange={(e) =>
                setSectionValues((v) => ({ ...v, achievements_title: e.target.value }))
              }
            />
          </FormField>
          <FormField label="Deskripsi" className="sm:col-span-2">
            <textarea
              className={textareaClass}
              rows={2}
              value={sectionValues.achievements_subtitle ?? ""}
              onChange={(e) =>
                setSectionValues((v) => ({ ...v, achievements_subtitle: e.target.value }))
              }
            />
          </FormField>
          {[1, 2, 3].map((n) => (
            <div key={n} className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
              <FormField label={`Statistik ${n} — Angka`}>
                <input
                  className={inputClass}
                  value={sectionValues[`achievements_counter_${n}_value`] ?? ""}
                  onChange={(e) =>
                    setSectionValues((v) => ({
                      ...v,
                      [`achievements_counter_${n}_value`]: e.target.value,
                    }))
                  }
                />
              </FormField>
              <FormField label={`Statistik ${n} — Label`}>
                <input
                  className={inputClass}
                  value={sectionValues[`achievements_counter_${n}_label`] ?? ""}
                  onChange={(e) =>
                    setSectionValues((v) => ({
                      ...v,
                      [`achievements_counter_${n}_label`]: e.target.value,
                    }))
                  }
                />
              </FormField>
            </div>
          ))}
        </div>
      </section>

      <AdminSearchInput
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Cari prestasi..."
      />

      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={items}
            keyExtractor={(r) => r.id}
            emptyMessage={search.trim() ? "Tidak ada hasil pencarian." : "Belum ada prestasi."}
          />
          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </>
      )}

      <AdminModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Prestasi"
        size="sm"
      >
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setDeleteId(null)}>
            Batal
          </button>
          <button
            type="button"
            className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white"
            onClick={async () => {
              if (!deleteId) return;
              try {
                await deleteAchievement(deleteId);
                setDeleteId(null);
                loadItems();
              } catch (e) {
                alert(getApiErrorMessage(e));
              }
            }}
          >
            Hapus
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
