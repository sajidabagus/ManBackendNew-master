"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { fetchNews, deleteNews } from "@/lib/api/news";
import { getApiErrorMessage } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Pagination } from "@/components/admin/ui/Pagination";
import type { NewsItem, PaginatedMeta } from "@/types/api";
import { shouldUnoptimizeMedia } from "@/lib/media-url";

export default function NewsListPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetchNews({
      search: search || undefined,
      status: status || undefined,
      page,
    })
      .then((res) => {
        setItems(res.data);
        setMeta(res.meta);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, status, page]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteNews(deleteId);
      setDeleteId(null);
      load();
    } catch (e) {
      alert(getApiErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<NewsItem>[] = [
    {
      key: "thumb",
      header: "",
      className: "w-16",
      render: (row) =>
        row.thumbnail_url ? (
          <Image
            src={row.thumbnail_url}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl object-cover"
            unoptimized={shouldUnoptimizeMedia(row.thumbnail_url)}
          />
        ) : (
          <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-teal-900" />
        ),
    },
    {
      key: "title",
      header: "Judul",
      render: (row) => (
        <div>
          <p className="font-medium">{row.title}</p>
          <p className="text-xs text-slate-500">{row.category?.name}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={
            row.status === "published"
              ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700"
              : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600"
          }
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "views",
      header: "Views",
      render: (row) => row.views,
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/news/${row.id}/edit`}
            className="rounded-lg p-2 text-primary hover:bg-primary/10"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(row.id)}
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
        title="CMS Berita"
        description="Kelola artikel dan berita sekolah"
        action={
          <Link
            href="/admin/news/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Berita
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm dark:border-teal-800 dark:bg-teal-950/50"
            placeholder="Cari berita..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm dark:border-teal-800 dark:bg-teal-950/50"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Semua status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={items}
            keyExtractor={(r) => r.id}
            emptyMessage="Belum ada berita."
          />
          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </>
      )}

      <AdminModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Berita"
        size="sm"
      >
        <p className="mb-4 text-sm text-slate-600">
          Yakin ingin menghapus berita ini?
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setDeleteId(null)}
            className="rounded-xl px-4 py-2 text-sm text-slate-600"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Hapus
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
