"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, ChevronDown } from "lucide-react";
import { navLinks, type NavLink } from "@/lib/data";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

interface NavbarProps {
  schoolName?: string;
  tagline?: string;
  logoUrl?: string;
}

function linkClass(scrolled: boolean) {
  return cn(
    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
    scrolled
      ? "text-slate-600 hover:bg-primary/5 hover:text-primary dark:text-teal-200 dark:hover:bg-teal-800/40 dark:hover:text-white"
      : "text-white/90 hover:bg-white/10 hover:text-white"
  );
}

function DesktopNavItem({
  link,
  scrolled,
}: {
  link: NavLink;
  scrolled: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!link.children?.length) {
    return (
      <li>
        <Link href={link.href} className={linkClass(scrolled)}>
          {link.label}
        </Link>
      </li>
    );
  }

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(linkClass(scrolled), "inline-flex items-center gap-1")}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {link.label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition", open && "rotate-180")}
        />
      </button>
      <ul
        className={cn(
          "absolute left-0 top-[calc(100%-4px)] z-50 min-w-[220px] rounded-2xl border py-2 shadow-soft transition",
          scrolled
            ? "border-slate-200/80 bg-white dark:border-teal-800 dark:bg-teal-950"
            : "border-white/20 bg-white/95 backdrop-blur-xl dark:border-teal-800 dark:bg-teal-950/95",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        )}
      >
        {link.children.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              className={cn(
                "block px-4 py-2.5 text-sm font-medium transition",
                pathname === child.href
                  ? "bg-primary/10 text-primary dark:bg-teal-800/60 dark:text-white"
                  : "text-slate-700 hover:bg-primary/5 hover:text-primary dark:text-teal-100 dark:hover:bg-teal-800/40"
              )}
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Navbar({
  schoolName = "MAN 2 Madiun",
  tagline = "Madrasah Digital",
  logoUrl,
}: NavbarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!isHome);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(!isHome || window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
        isOpen && "bg-white dark:bg-teal-950 lg:bg-transparent lg:dark:bg-transparent",
        scrolled
          ? "bg-white/80 py-3 shadow-glass backdrop-blur-xl dark:bg-teal-950/85"
          : "bg-transparent py-4 md:py-5"
      )}
    >
      <nav className="container-custom flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/#beranda" className="group flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl transition-all duration-300",
              scrolled
                ? "bg-primary text-white shadow-soft"
                : "glass text-primary dark:text-white",
              logoUrl && (scrolled ? "bg-white" : "bg-white/90")
            )}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={schoolName}
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <GraduationCap className="h-6 w-6" />
            )}
          </div>
          <div className="hidden sm:block">
            <p
              className={cn(
                "font-display text-sm font-bold leading-tight",
                scrolled
                  ? "text-secondary-dark dark:text-white"
                  : "text-white"
              )}
            >
              {schoolName}
            </p>
            <p
              className={cn(
                "text-[10px] font-medium uppercase tracking-wider",
                scrolled
                  ? "text-primary dark:text-teal-300"
                  : "text-teal-200"
              )}
            >
              {tagline}
            </p>
          </div>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <DesktopNavItem key={link.href} link={link} scrolled={scrolled} />
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            type="button"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl lg:hidden",
              isOpen || scrolled
                ? "bg-primary/10 text-primary dark:bg-teal-800 dark:text-white"
                : "glass text-white dark:text-teal-100"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "overflow-hidden border-t backdrop-blur-xl transition-all duration-300 lg:hidden",
          "border-slate-200 bg-white dark:border-teal-700 dark:bg-teal-950",
          isOpen ? "max-h-[80vh] overflow-y-auto opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.children?.length ? (
                <div>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-medium text-slate-900 dark:text-white"
                    onClick={() =>
                      setOpenMobileGroup((current) =>
                        current === link.label ? null : link.label
                      )
                    }
                    aria-expanded={openMobileGroup === link.label}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition",
                        openMobileGroup === link.label && "rotate-180"
                      )}
                    />
                  </button>
                  {openMobileGroup === link.label && (
                    <ul className="mb-1 ml-3 space-y-1 border-l border-slate-200 pl-3 dark:border-teal-800">
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-primary/10 hover:text-primary dark:text-teal-100 dark:hover:bg-teal-800"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-4 py-3 font-medium text-slate-900 transition hover:bg-primary/10 hover:text-primary dark:text-white dark:hover:bg-teal-800 dark:hover:text-teal-50"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
