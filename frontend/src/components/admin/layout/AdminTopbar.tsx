"use client";

import { Menu, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

interface AdminTopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function AdminTopbar({ onMenuClick, title }: AdminTopbarProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-teal-800/50 dark:bg-teal-950/80 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-teal-200 dark:hover:bg-teal-900"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <h2 className="hidden font-display text-lg font-semibold text-secondary-dark sm:block dark:text-white">
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-teal-200 dark:hover:bg-teal-900"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">
            {user?.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-teal-400">
            {user?.roles?.[0] ?? "Admin"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
