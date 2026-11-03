"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ServiceForm, type ServiceFormValues } from "@/components/admin/services/ServiceForm";
import { fetchService, updateService } from "@/lib/api/services";
import { getApiErrorMessage } from "@/lib/api/client";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import type { ServiceItem } from "@/types/api";

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<ServiceItem | null>(null);

  useEffect(() => {
    fetchService(Number(id))
      .then(setItem)
      .catch(() => router.push("/admin/services"));
  }, [id, router]);

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      await updateService(Number(id), {
        ...values,
        url: values.url || null,
      });
      router.push("/admin/services");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  if (!item) return <TableSkeleton rows={5} />;

  return (
    <div>
      <PageHeader title="Edit Layanan" backHref="/admin/services" />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <ServiceForm initial={item} onSubmit={handleSubmit} submitLabel="Perbarui" />
      </div>
    </div>
  );
}
