import type { ComplaintPriority, ComplaintStatus, ReporterType } from "@/types/complaints";

export const reporterTypeLabels: Record<ReporterType, string> = {
  siswa: "Siswa",
  orang_tua: "Orang tua / wali",
  guru_tendik: "Guru / tenaga kependidikan",
  masyarakat: "Masyarakat",
};

export const statusLabels: Record<ComplaintStatus, string> = {
  submitted: "Baru masuk",
  under_review: "Sedang ditinjau",
  assigned: "Ditugaskan",
  in_progress: "Sedang ditindaklanjuti",
  waiting_reporter: "Menunggu informasi pelapor",
  resolved: "Selesai",
  closed: "Ditutup",
  rejected: "Tidak dapat ditindaklanjuti",
};

export const priorityLabels: Record<ComplaintPriority, string> = {
  low: "Rendah",
  normal: "Normal",
  high: "Tinggi",
  urgent: "Mendesak",
};

export const statusBadgeClass: Record<ComplaintStatus, string> = {
  submitted: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  under_review: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
  assigned: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
  in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  waiting_reporter: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  closed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
};
