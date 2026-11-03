"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Loader2, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { fetchCaptchaApi } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { FormField, inputClass } from "@/components/admin/ui/FormField";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  captcha_answer: z
    .string()
    .min(1, "Captcha wajib diisi")
    .regex(/^-?\d+$/, "Masukkan angka hasil perhitungan"),
});

type LoginForm = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(true);

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const data = await fetchCaptchaApi();
      setCaptchaId(data.captcha_id);
      setCaptchaQuestion(data.question);
    } catch {
      setCaptchaId("");
      setCaptchaQuestion("");
      setError("Gagal memuat captcha. Coba muat ulang halaman.");
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("session") === "expired"
    ) {
      setError("Sesi login habis. Silakan login ulang.");
    }
    loadCaptcha();
  }, [loadCaptcha]);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    if (!captchaId) {
      setError("Captcha belum siap. Klik muat ulang captcha.");
      return;
    }
    try {
      await login(
        data.email,
        data.password,
        captchaId,
        data.captcha_answer.trim(),
      );
      router.push("/admin/dashboard");
    } catch (e) {
      setError(getApiErrorMessage(e));
      resetField("captcha_answer");
      await loadCaptcha();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary-dark via-primary to-teal-900 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-premium backdrop-blur-xl dark:bg-teal-950/95">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-secondary-dark dark:text-white">
            Login Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-teal-300">
            MAN 2 Kota Madiun
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Email" error={errors.email?.message} required>
            <input
              type="email"
              className={inputClass}
              {...register("email")}
            />
          </FormField>
          <FormField label="Password" error={errors.password?.message} required>
            <input
              type="password"
              className={inputClass}
              {...register("password")}
            />
          </FormField>
          <FormField
            label="Captcha"
            error={errors.captcha_answer?.message}
            required
          >
            <div className="flex items-stretch gap-2">
              <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-lg font-semibold tracking-wide text-secondary-dark dark:border-teal-800 dark:bg-teal-900/40 dark:text-white">
                {captchaLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                ) : (
                  captchaQuestion || "—"
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  resetField("captcha_answer");
                  loadCaptcha();
                }}
                disabled={captchaLoading}
                className="flex shrink-0 items-center justify-center rounded-2xl border border-slate-200 px-3 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-teal-800 dark:text-teal-200 dark:hover:bg-teal-900/50"
                title="Muat ulang captcha"
                aria-label="Muat ulang captcha"
              >
                <RefreshCw
                  className={`h-5 w-5 ${captchaLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Jawaban"
              className={`${inputClass} mt-2`}
              disabled={captchaLoading || !captchaId}
              {...register("captcha_answer")}
            />
          </FormField>
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || captchaLoading || !captchaId}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-display font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
