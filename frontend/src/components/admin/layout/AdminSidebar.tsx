"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Layers, X } from "lucide-react";
import { adminNavIcons } from "@/lib/admin-nav-icons";
import { cn } from "@/lib/utils";

const navSections = [
  {
    title: "Utama",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" }],
  },
  {
    title: "Konten",
    items: [
      { href: "/admin/news", label: "Berita", icon: "news" },
      { href: "/admin/categories", label: "Kategori Berita", icon: "categories" },
      { href: "/admin/gallery", label: "Galeri", icon: "gallery" },
      { href: "/admin/organization", label: "Struktur Organisasi", icon: "organization" },
      { href: "/admin/achievements", label: "Prestasi", icon: "achievements" },
      { href: "/admin/testimonials", label: "Testimoni Alumni", icon: "testimonials" },
      { href: "/admin/faqs", label: "FAQ", icon: "faqs" },
      { href: "/admin/integrity-zone", label: "Zona Integritas", icon: "integrity" },
    ],
  },
  {
    title: "Layanan",
    items: [
      { href: "/admin/services", label: "Layanan Digital", icon: "services" },
      { href: "/admin/complaints", label: "Pengaduan", icon: "complaints" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { href: "/admin/settings", label: "Pengaturan", icon: "settings" },
      { href: "/admin/users", label: "Pengguna", icon: "users" },
    ],
  },
] as const;

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 dark:border-teal-800/50 dark:bg-teal-950 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 dark:border-teal-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-secondary-dark dark:text-white">
                MAN 2 Kota Madiun
              </p>
              <p className="text-[10px] text-primary">Admin Panel</p>
            </div>
          </Link>
          <button
            type="button"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {navSections.map((section) => (
            <div key={section.title} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-teal-500">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  const Icon = adminNavIcons[item.icon];
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
                          active
                            ? "bg-primary text-white shadow-soft"
                            : "text-slate-600 hover:bg-primary/5 dark:text-teal-200 dark:hover:bg-teal-900/50"
                        )}
                      >
                        {Icon ? <Icon className="h-5 w-5 shrink-0" /> : null}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-2 border-t border-slate-100 p-4 dark:border-teal-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-primary dark:text-teal-400"
          >
            <Layers className="h-3.5 w-3.5" />
            Lihat Website →
          </Link>
        </div>
      </aside>
    </>
  );
}
