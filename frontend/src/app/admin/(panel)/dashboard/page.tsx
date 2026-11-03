"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Users,
  Newspaper,
  Briefcase,
  Images,
  Eye,
  TrendingUp,
} from "lucide-react";
import { fetchDashboard } from "@/lib/api/dashboard";
import { getApiErrorMessage } from "@/lib/api/client";
import { StatCard } from "@/components/admin/ui/StatCard";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { CardSkeleton, LoadingSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import type { DashboardAnalytics } from "@/types/api";

const DashboardCharts = dynamic(
  () =>
    import("@/components/admin/dashboard/DashboardCharts").then(
      (m) => m.DashboardCharts
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-2">
        <LoadingSkeleton className="h-[320px] w-full" />
        <LoadingSkeleton className="h-[320px] w-full" />
      </div>
    ),
  }
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchDashboard(7)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e) => {
        if (!cancelled) setError(getApiErrorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Ringkasan statistik website MAN 2 Kota Madiun"
        />
        <CardSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</p>
    );
  }

  if (!data) return null;

  const { stats, analytics } = data;
  const recentNews = analytics.recent_news ?? [];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Ringkasan statistik website MAN 2 Kota Madiun"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Siswa"
          value={stats.total_students.toLocaleString("id-ID")}
          icon={Users}
        />
        <StatCard
          label="Total Berita"
          value={stats.total_news}
          icon={Newspaper}
          trend={`${stats.published_news} published`}
        />
        <StatCard
          label="Layanan Aktif"
          value={stats.total_services}
          icon={Briefcase}
        />
        <StatCard
          label="Pengunjung Hari Ini"
          value={stats.visitor_today}
          icon={Eye}
          trend={`${stats.visitor_total} total views`}
        />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Galeri"
          value={stats.total_galleries}
          icon={Images}
        />
        <StatCard
          label="Draft Berita"
          value={stats.draft_news}
          icon={TrendingUp}
        />
      </div>

      <DashboardCharts analytics={analytics} />

      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-teal-800/50 dark:bg-teal-950/60">
        <h3 className="mb-4 font-display font-semibold">Berita Terbaru</h3>
        <ul className="space-y-3">
          {recentNews.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-teal-900/30"
            >
              <span className="font-medium text-slate-800 dark:text-teal-100">
                {item.title}
              </span>
              <span className="text-xs text-slate-500">{item.views} views</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
