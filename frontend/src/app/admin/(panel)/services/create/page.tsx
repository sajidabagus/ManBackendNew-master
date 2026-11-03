"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ServiceForm, type ServiceFormValues } from "@/components/admin/services/ServiceForm";
import { createService } from "@/lib/api/services";
import { getApiErrorMessage } from "@/lib/api/client";

export default function CreateServicePage() {
  const router = useRouter();

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      await createService({
        ...values,
        url: values.url || null,
      });
      router.push("/admin/services");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader title="Tambah Layanan" backHref="/admin/services" />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <ServiceForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
