"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Download,
  Inbox,
  Loader2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  exportComplaints,
  fetchAdminComplaintCategories,
  fetchComplaintDashboard,
  fetchComplaints,
} from "@/lib/api/complaints";
import { getApiErrorMessage } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { TableSkeleton, CardSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import { Pagination } from "@/components/admin/ui/Pagination";
import { AdminSearchInput } from "@/components/admin/ui/AdminSearchInput";
import {
  priorityLabels,
  reporterTypeLabels,
  statusBadgeClass,
  statusLabels,
} from "@/lib/complaint-labels";
import { useAuthStore } from "@/stores/auth-store";
import type { PaginatedMeta } from "@/types/api";
import type {
  AdminComplaintListItem,
  ComplaintCategory,
  ComplaintDashboardStats,
  ComplaintStatus,
} from "@/types/complaints";

const statusOptions: ComplaintStatus[] = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "waiting_reporter",
  "resolved",
  "closed",
  "rejected",
];

const selectClass =
  "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-teal-800 dark:bg-teal-950/50 dark:text-white";

export default function ComplaintsAdminPage() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canExport = permissions.includes("complaints.export");
  const canManageCategories = permissions.includes("complaints.manage_categories");

  const [stats, setStats] = useState<ComplaintDashboardStats | null>(null);
  const [items, setItems] = useState<AdminComplaintListItem[]>([]);
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setStatsLoading(true);
    fetchComplaintDashboard()
      .then(setStats)
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setStatsLoading(false));
    fetchAdminComplaintCategories({ page: 1 })
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetchComplaints({
      page,
      search: search || undefined,
      status: status || undefined,
      category_id: categoryId || undefined,
      from: from || undefined,
      to: to || undefined,
    })
      .then((res) => {
        setItems(res.data);
        setMeta(res.meta);
        setError("");
      })
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [page, search, status, categoryId, from, to]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const trendData = useMemo(
    () =>
      (stats?.trend ?? []).map((row) => ({
        name: row.date.slice(5),
        total: Number(row.total),
      })),
    [stats],
  );

  const categoryData = useMemo(
    () =>
      (stats?.by_category ?? []).map((row) => ({
        name: row.name,
        total: Number(row.total),
      })),
    [stats],
  );

  const columns: Column<AdminComplaintListItem>[] = [
    { key: "ticket", header: "Tiket", render: (r) => r.ticket_number },
    { key: "title", header: "Judul", render: (r) => r.title },
    { key: "category", header: "Kategori", render: (r) => r.category?.name ?? "—" },
    {
      key: "reporter",
      header: "Pelapor",
      render: (r) => reporterTypeLabels[r.reporter_type] ?? r.reporter_type,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeClass[r.status]}`}>
          {r.status_label ?? statusLabels[r.status]}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Prioritas",
      render: (r) => priorityLabels[r.priority] ?? r.priority,
    },
    { key: "assignee", header: "Petugas", render: (r) => r.assignee?.name ?? "—" },
    {
      key: "date",
      header: "Masuk",
      render: (r) =>
        r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID") : "—",
    },
    {
      key: "actions",
      header: "Aksi",
      render: (r) => (
        <Link
          href={`/admin/complaints/${r.id}`}
          className="font-semibold text-primary hover:underline"
        >
          Detail
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Layanan Pengaduan"
        description="Ringkasan dan daftar laporan yang masuk ke madrasah"
        action={
          <div className="flex flex-wrap gap-2">
            {canManageCategories && (
              <Link
                href="/admin/complaints/categories"
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-teal-800"
              >
                Kelola kategori
              </Link>
            )}
            {canExport && (
              <button
                type="button"
                disabled={exporting}
                onClick={async () => {
                  setExporting(true);
                  try {
                    await exportComplaints({
                      status,
                      category_id: categoryId,
                      from,
                      to,
                    });
                  } catch (e) {
                    alert(getApiErrorMessage(e));
                  } finally {
                    setExporting(false);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Ekspor CSV
              </button>
            )}
          </div>
        }
      />

      {statsLoading ? (
        <CardSkeleton count={4} />
      ) : stats ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total laporan" value={stats.total} icon={ClipboardList} />
          <StatCard label="Laporan baru" value={stats.new} icon={Inbox} />
          <StatCard label="Dalam proses" value={stats.in_progress} icon={Loader2} />
          <StatCard label="Selesai" value={stats.resolved} icon={CheckCircle2} />
          <StatCard label="Prioritas tinggi" value={stats.high_priority} icon={AlertTriangle} />
        </div>
      ) : null}

      {stats && (
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-teal-800/50 dark:bg-teal-950/60">
            <h3 className="mb-4 font-display font-semibold">Tren 30 hari</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#0F766E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-teal-800/50 dark:bg-teal-950/60">
            <h3 className="mb-4 font-display font-semibold">Berdasarkan kategori</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#0F766E" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <AdminSearchInput
          value={search}
          onChange={(value) => {
            setPage(1);
            setSearch(value);
          }}
          placeholder="Cari nomor tiket atau judul"
        />
        <select
          className={selectClass}
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">Semua status</option>
          {statusOptions.map((item) => (
            <option key={item} value={item}>
              {statusLabels[item]}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={categoryId}
          onChange={(e) => {
            setPage(1);
            setCategoryId(e.target.value);
          }}
        >
          <option value="">Semua kategori</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          className={selectClass}
          value={from}
          onChange={(e) => {
            setPage(1);
            setFrom(e.target.value);
          }}
        />
        <input
          type="date"
          className={selectClass}
          value={to}
          onChange={(e) => {
            setPage(1);
            setTo(e.target.value);
          }}
        />
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={items}
            keyExtractor={(r) => r.id}
            emptyMessage="Belum ada pengaduan."
          />
          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
