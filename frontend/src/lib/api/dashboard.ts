import { apiClient } from "./client";
import type { DashboardAnalytics, NewsItem } from "@/types/api";

function unwrapList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (
    value &&
    typeof value === "object" &&
    "data" in value &&
    Array.isArray((value as { data: unknown }).data)
  ) {
    return (value as { data: T[] }).data;
  }
  return [];
}

export async function fetchDashboard(days = 7): Promise<DashboardAnalytics> {
  const { data } = await apiClient.get<DashboardAnalytics>("/dashboard", {
    params: { days },
  });

  return {
    ...data,
    analytics: {
      ...data.analytics,
      news_chart: Array.isArray(data.analytics?.news_chart)
        ? data.analytics.news_chart
        : [],
      recent_news: unwrapList<NewsItem>(data.analytics?.recent_news),
      visitor_chart: data.analytics?.visitor_chart ?? {
        labels: [],
        page_views: [],
        unique_visitors: [],
      },
    },
  };
}
