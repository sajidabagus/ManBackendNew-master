"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createComplaintCategory,
  deleteComplaintCategory,
  fetchAdminComplaintCategories,
  updateComplaintCategory,
} from "@/lib/api/complaints";
import { getApiErrorMessage } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import { Pagination } from "@/components/admin/ui/Pagination";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { FormField, inputClass, selectClass, textareaClass } from "@/components/admin/ui/FormField";
import { priorityLabels } from "@/lib/complaint-labels";
import type { PaginatedMeta } from "@/types/api";
import type { ComplaintCategory, ComplaintPriority } from "@/types/complaints";

const emptyForm = {
  name: "",
  description: "",
  default_priority: "normal" as ComplaintPriority,
  is_active: true,
  is_sensitive: false,
  sort_order: 0,
};

export default function ComplaintCategoriesPage() {
  const [items, setItems] = useState<ComplaintCategory[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ComplaintCategory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchAdminComplaintCategories({ page })
      .then((res) => {
        setItems(res.data);
        setMeta(res.meta);
      })
      .catch((e) => alert(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: ComplaintCategory) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description ?? "",
      default_priority: item.default_priority ?? "normal",
      is_active: item.is_active ?? true,
      is_sensitive: item.is_sensitive ?? false,
      sort_order: item.sort_order ?? 0,
    });
    setModalOpen(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await updateComplaintCategory(editing.id, form);
      } else {
        await createComplaintCategory(form);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  const columns: Column<ComplaintCategory>[] = [
    { key: "name", header: "Nama", render: (r) => r.name },
    {
      key: "priority",
      header: "Prioritas default",
      render: (r) => priorityLabels[r.default_priority ?? "normal"],
    },
    {
      key: "sensitive",
      header: "Sensitif",
      render: (r) => (r.is_sensitive ? "Ya" : "Tidak"),
    },
    {
      key: "active",
      header: "Status",
      render: (r) => (r.is_active ? "Aktif" : "Nonaktif"),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (r) => (
        <div className="flex gap-2">
          <button type="button" className="rounded-lg p-2 text-primary" onClick={() => openEdit(r)}>
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" className="rounded-lg p-2 text-red-500" onClick={() => setDeleteId(r.id)}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Kategori Pengaduan"
        description="Kelola kategori yang tampil pada formulir publik"
        backHref="/admin/complaints"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Tambah kategori
          </button>
        }
      />

      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <DataTable columns={columns} data={items} keyExtractor={(r) => r.id} />
          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit kategori" : "Tambah kategori"}
      >
        <div className="space-y-4">
          <FormField label="Nama" required>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>
          <FormField label="Deskripsi">
            <textarea
              className={textareaClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </FormField>
          <FormField label="Prioritas default">
            <select
              className={selectClass}
              value={form.default_priority}
              onChange={(e) =>
                setForm({ ...form, default_priority: e.target.value as ComplaintPriority })
              }
            >
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Aktif
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_sensitive}
              onChange={(e) => setForm({ ...form, is_sensitive: e.target.checked })}
            />
            Kategori sensitif (akses identitas terbatas)
          </label>
          <button
            type="button"
            onClick={save}
            className="w-full rounded-2xl bg-primary py-2.5 font-semibold text-white"
          >
            Simpan
          </button>
        </div>
      </AdminModal>

      <AdminModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus kategori" size="sm">
        <p className="mb-4 text-sm">Kategori yang masih dipakai laporan tidak dapat dihapus.</p>
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
                await deleteComplaintCategory(deleteId);
                setDeleteId(null);
                load();
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
