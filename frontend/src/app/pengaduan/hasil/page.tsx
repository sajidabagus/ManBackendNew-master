"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { readComplaintReceipt } from "@/lib/complaint-session";
import type { ComplaintReceipt } from "@/types/complaints";

export default function ComplaintResultPage() {
  const [receipt, setReceipt] = useState<ComplaintReceipt | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setReceipt(readComplaintReceipt());
  }, []);

  const copyText = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  if (!receipt) {
    return (
      <div className="container-custom section-padding">
        <h1 className="font-display text-3xl font-bold text-secondary-dark dark:text-white">
          Kode akses tidak dapat ditampilkan ulang
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-teal-200">
          Demi keamanan, kode akses rahasia hanya ditampilkan sekali setelah pengaduan
          berhasil dibuat. Jika Anda sudah menyimpan nomor tiket, gunakan halaman pelacakan.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/pengaduan/lacak">Cek status pengaduan</Button>
          <Button href="/pengaduan" variant="ghost">
            Buat pengaduan baru
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-soft dark:bg-teal-950/70 sm:p-8">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-bold text-secondary-dark dark:text-white">
          Pengaduan berhasil dikirim
        </h1>
        <p className="mt-2 text-slate-600 dark:text-teal-200">
          Simpan nomor tiket dan kode akses di tempat yang aman. Kode akses tidak akan
          ditampilkan ulang oleh sistem.
        </p>

        <div className="mt-6 space-y-4">
          <SecretBox
            label="Nomor tiket"
            value={receipt.ticket_number}
            onCopy={() => copyText(receipt.ticket_number, "tiket")}
          />
          <SecretBox
            label="Kode akses rahasia"
            value={receipt.access_code}
            onCopy={() => copyText(receipt.access_code, "kode")}
          />
        </div>

        {copied && (
          <p className="mt-3 text-sm text-primary">Berhasil menyalin {copied}.</p>
        )}

        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Jangan bagikan kode akses kepada pihak yang tidak berwenang. MAN 2 Kota Madiun
          tidak akan meminta kode akses melalui media sosial atau pesan pribadi.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/pengaduan/lacak">Cek status pengaduan</Button>
          <Link href="/pengaduan" className="text-sm font-medium text-primary hover:underline">
            Kirim pengaduan lain
          </Link>
        </div>
      </div>
    </div>
  );
}

function SecretBox({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 dark:border-teal-800">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <code className="break-all text-sm font-semibold text-secondary-dark dark:text-white">
          {value}
        </code>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
        >
          <Copy className="h-3.5 w-3.5" />
          Salin
        </button>
      </div>
    </div>
  );
}
