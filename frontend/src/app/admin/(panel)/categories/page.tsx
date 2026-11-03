"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminSearchInput } from "@/components/admin/ui/AdminSearchInput";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/categories";
import { getApiErrorMessage } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import { FormField, inputClass } from "@/components/admin/ui/FormField";
import type { NewsCategory } from "@/types/api";

const AdminModal = dynamic(
  () =>
    import("@/components/admin/ui/AdminModal").then((m) => m.AdminModal),
  { ssr: false }
);

type FormState = { name: string; description: string; is_active: boolean };

const emptyForm: FormState = { name: "", description: "", is_active: true };

export default function CategoriesPage() {
  const [items, setItems] = useState<NewsCategory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsCategory | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetchCategories()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (cat: NewsCategory) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description ?? "",
      is_active: cat.is_active ?? true,
    });
    setFormError("");
    setModalOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      setFormError("Nama minimal 2 karakter");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        is_active: form.is_active,
      };
      if (editing) {
        await updateCategory(editing.id, payload);
      } else {
        await createCategory(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<NewsCategory>[] = [
    { key: "name", header: "Nama", render: (r) => r.name },
    { key: "slug", header: "Slug", render: (r) => r.slug },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <span
          className={
            r.is_active !== false ? "text-green-600" : "text-slate-400"
          }
        >
          {r.is_active !== false ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(r)}
            className="rounded-lg p-2 text-primary hover:bg-primary/10"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(r.id)}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
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
        title="Kategori Berita"
        description="Kelola kategori untuk artikel berita"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </button>
        }
      />

      <AdminSearchInput
        value={search}
        onChange={setSearch}
        placeholder="Cari kategori..."
      />

      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={items.filter((item) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return (
              item.name.toLowerCase().includes(q) ||
              item.slug.toLowerCase().includes(q) ||
              (item.description ?? "").toLowerCase().includes(q)
            );
          })}
          keyExtractor={(r) => r.id}
          emptyMessage={search.trim() ? "Tidak ada hasil pencarian." : "Belum ada kategori."}
        />
      )}

      {modalOpen && (
        <AdminModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? "Edit Kategori" : "Tambah Kategori"}
        >
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField label="Nama" error={formError} required>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </FormField>
            <FormField label="Deskripsi">
              <input
                className={inputClass}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </FormField>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_active: e.target.checked }))
                }
              />
              Aktif
            </label>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-primary py-2.5 font-semibold text-white disabled:opacity-60"
            >
              Simpan
            </button>
          </form>
        </AdminModal>
      )}

      {deleteId !== null && (
        <AdminModal
          open
          onClose={() => setDeleteId(null)}
          title="Hapus Kategori"
          size="sm"
        >
          <p className="mb-4 text-sm text-slate-600">
            Yakin hapus kategori ini?
          </p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setDeleteId(null)}>
              Batal
            </button>
            <button
              type="button"
              className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white"
              onClick={async () => {
                try {
                  await deleteCategory(deleteId);
                  setDeleteId(null);
                  load();
                } catch (err) {
                  alert(getApiErrorMessage(err));
                }
              }}
            >
              Hapus
            </button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
