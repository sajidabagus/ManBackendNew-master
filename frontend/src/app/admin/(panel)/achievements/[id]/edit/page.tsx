"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  AchievementForm,
  type AchievementFormValues,
} from "@/components/admin/achievements/AchievementForm";
import { fetchAchievement, updateAchievement } from "@/lib/api/achievements";
import { getApiErrorMessage } from "@/lib/api/client";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import type { AchievementItem } from "@/types/api";

export default function EditAchievementPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [item, setItem] = useState<AchievementItem | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchAchievement(id)
      .then(setItem)
      .catch(() => router.replace("/admin/achievements"));
  }, [id, router]);

  const handleSubmit = async (values: AchievementFormValues) => {
    try {
      await updateAchievement(id, values);
      router.push("/admin/achievements");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  if (!item) return <TableSkeleton rows={6} />;

  return (
    <div>
      <PageHeader title="Edit Prestasi" backHref="/admin/achievements" />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <AchievementForm initial={item} onSubmit={handleSubmit} submitLabel="Perbarui" />
      </div>
    </div>
  );
}
