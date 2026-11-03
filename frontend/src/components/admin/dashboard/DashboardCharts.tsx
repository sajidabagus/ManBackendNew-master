"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { DashboardAnalytics } from "@/types/api";

interface DashboardChartsProps {
  analytics: DashboardAnalytics["analytics"];
}

export function DashboardCharts({ analytics }: DashboardChartsProps) {
  const labels = analytics.visitor_chart?.labels ?? [];
  const chartData = labels.map((label, i) => ({
    name: label,
    views: analytics.visitor_chart.page_views[i] ?? 0,
    visitors: analytics.visitor_chart.unique_visitors[i] ?? 0,
  }));

  const newsChartData = (analytics.news_chart ?? []).map((n) => ({
    name: n.month,
    total: n.total,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-teal-800/50 dark:bg-teal-950/60">
        <h3 className="mb-4 font-display font-semibold text-secondary-dark dark:text-white">
          Statistik Pengunjung (7 hari)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#0F766E"
              fill="url(#colorViews)"
              name="Page Views"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-teal-800/50 dark:bg-teal-950/60">
        <h3 className="mb-4 font-display font-semibold text-secondary-dark dark:text-white">
          Berita per Bulan
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={newsChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="total" fill="#F59E0B" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
