"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Cari...",
  className,
}: AdminSearchInputProps) {
  return (
    <div className={cn("relative mb-4 max-w-md", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm dark:border-teal-800 dark:bg-teal-950/50"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
