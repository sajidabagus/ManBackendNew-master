"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { fetchServices, deleteService } from "@/lib/api/services";
import { getApiErrorMessage } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import { Pagination } from "@/components/admin/ui/Pagination";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import type { PaginatedMeta, ServiceItem } from "@/types/api";

export default function ServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchServices({ page })
      .then((res) => {
        setItems(res.data);
        setMeta(res.meta);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const columns: Column<ServiceItem>[] = [
    { key: "title", header: "Layanan", render: (r) => r.title },
    { key: "icon", header: "Icon", render: (r) => r.icon ?? "—" },
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
            href={`/admin/services/${r.id}/edit`}
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
        title="Layanan Digital"
        description="PTSP, PPDB, CBT, E-Learning, dll."
        action={
          <Link
            href="/admin/services/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Tambah Layanan
          </Link>
        }
      />

      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={items}
            keyExtractor={(r) => r.id}
            emptyMessage="Belum ada layanan."
          />
          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </>
      )}

      <AdminModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Layanan"
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
                await deleteService(deleteId);
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
