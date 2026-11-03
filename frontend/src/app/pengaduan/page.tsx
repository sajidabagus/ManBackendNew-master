import Link from "next/link";
import { ComplaintForm } from "@/components/pengaduan/ComplaintForm";

export default function PengaduanPage() {
  return (
    <div className="container-custom section-padding">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        Layanan Pengaduan
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-secondary-dark dark:text-white">
        Buat Pengaduan
      </h1>
      <p className="mt-3 max-w-3xl text-slate-600 dark:text-teal-200">
        Layanan ini dapat digunakan oleh siswa, orang tua atau wali, guru dan tenaga
        kependidikan, serta masyarakat. Anda tidak perlu membuat akun. Setelah laporan
        terkirim, simpan nomor tiket dan kode akses untuk memantau perkembangan.
      </p>
      <p className="mt-3 text-sm">
        Sudah memiliki tiket?{" "}
        <Link href="/pengaduan/lacak" className="font-semibold text-primary hover:underline">
          Cek status pengaduan
        </Link>
      </p>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft dark:bg-teal-950/70 sm:p-8">
        <ComplaintForm />
      </div>
    </div>
  );
}
