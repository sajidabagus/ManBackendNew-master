import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-secondary via-primary to-secondary-dark">
      <div className="absolute h-32 w-32 animate-spin-slow rounded-full border-2 border-dashed border-accent/40" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
        <GraduationCap className="h-10 w-10" />
      </div>
      <p className="mt-6 animate-pulse-soft font-display text-lg font-semibold text-white">
        MAN 2 Kota Madiun
      </p>
      <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-2/5 animate-pulse rounded-full bg-accent" />
      </div>
    </div>
  );
}
