"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  TestimonialForm,
  type TestimonialFormValues,
} from "@/components/admin/testimonials/TestimonialForm";
import { createTestimonial } from "@/lib/api/testimonials";
import { appendFormValues } from "@/lib/api/form-data";
import { getApiErrorMessage } from "@/lib/api/client";

export default function CreateTestimonialPage() {
  const router = useRouter();

  const handleSubmit = async (values: TestimonialFormValues, photo?: File) => {
    const fd = new FormData();
    appendFormValues(fd, values);
    if (photo) fd.append("photo", photo);
    try {
      await createTestimonial(fd);
      router.push("/admin/testimonials");
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader title="Tambah Testimoni" backHref="/admin/testimonials" />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-teal-800/50 dark:bg-teal-950/40">
        <TestimonialForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
