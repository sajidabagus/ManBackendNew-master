"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { FaqForm, type FaqFormValues } from "@/components/admin/faqs/FaqForm";
import { createFaq } from "@/lib/api/faqs";
import { getApiErrorMessage } from "@/lib/api/client";

export default function CreateFaqPage() {
  const router = useRouter();

  const handleSubmit = async (values: FaqFormValues) => {
    try {
      await createFaq(values);
      router.push("/admin/faqs");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader title="Tambah FAQ" backHref="/admin/faqs" />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <FaqForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
