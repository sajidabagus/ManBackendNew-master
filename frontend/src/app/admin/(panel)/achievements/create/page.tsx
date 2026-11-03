"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  AchievementForm,
  type AchievementFormValues,
} from "@/components/admin/achievements/AchievementForm";
import { createAchievement } from "@/lib/api/achievements";
import { getApiErrorMessage } from "@/lib/api/client";

export default function CreateAchievementPage() {
  const router = useRouter();

  const handleSubmit = async (values: AchievementFormValues) => {
    try {
      await createAchievement(values);
      router.push("/admin/achievements");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader title="Tambah Prestasi" backHref="/admin/achievements" />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <AchievementForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
