"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { FaqForm, type FaqFormValues } from "@/components/admin/faqs/FaqForm";
import { fetchFaq, updateFaq } from "@/lib/api/faqs";
import { getApiErrorMessage } from "@/lib/api/client";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import type { FaqItem } from "@/types/api";

export default function EditFaqPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [item, setItem] = useState<FaqItem | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchFaq(id)
      .then(setItem)
      .catch(() => router.replace("/admin/faqs"));
  }, [id, router]);

  const handleSubmit = async (values: FaqFormValues) => {
    try {
      await updateFaq(id, values);
      router.push("/admin/faqs");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  if (!item) return <TableSkeleton rows={6} />;

  return (
    <div>
      <PageHeader title="Edit FAQ" backHref="/admin/faqs" />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <FaqForm initial={item} onSubmit={handleSubmit} submitLabel="Perbarui" />
      </div>
    </div>
  );
}
