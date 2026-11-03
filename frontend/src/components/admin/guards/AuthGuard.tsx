"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { getAuthToken } from "@/lib/auth-token";
import { LoadingSkeleton } from "@/components/admin/ui/LoadingSkeleton";

const AUTH_VERIFIED_KEY = "man2_auth_verified_at";
const AUTH_TTL_MS = 10 * 60 * 1000;

function isRecentlyVerified(): boolean {
  if (typeof window === "undefined") return false;
  const raw = sessionStorage.getItem(AUTH_VERIFIED_KEY);
  if (!raw) return false;
  return Date.now() - Number(raw) < AUTH_TTL_MS;
}

function markVerified(): void {
  sessionStorage.setItem(AUTH_VERIFIED_KEY, String(Date.now()));
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      const token = getAuthToken();
      if (!token) {
        setAllowed(false);
        router.replace("/admin/login");
        return;
      }

      setAllowed(true);

      const state = useAuthStore.getState();
      if (state.isAuthenticated && state.user && isRecentlyVerified()) {
        return;
      }

      try {
        await state.fetchUser(
          Boolean(state.isAuthenticated && state.user)
        );
        markVerified();
      } catch {
        sessionStorage.removeItem(AUTH_VERIFIED_KEY);
        clearAuth();
        setAllowed(false);
        router.replace("/admin/login?session=expired");
      }
    };

    if (useAuthStore.persist.hasHydrated()) {
      void verify();
      return;
    }

    return useAuthStore.persist.onFinishHydration(() => {
      void verify();
    });
  }, [router, clearAuth]);

  if (allowed === false) return null;

  if (allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-secondary-dark">
        <LoadingSkeleton className="h-12 w-48" />
      </div>
    );
  }

  return <>{children}</>;
}
