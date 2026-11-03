import { CardSkeleton } from "@/components/admin/ui/LoadingSkeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-teal-900/50" />
      <CardSkeleton count={4} />
    </div>
  );
}
