import { Award, CheckCircle2, Quote } from "lucide-react";
import { schoolInfo } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import type { SchoolProfile } from "@/types/public";

interface PrincipalWelcomeProps {
  profile?: SchoolProfile;
}

export function PrincipalWelcome({ profile }: PrincipalWelcomeProps) {
  const p = profile;
  const principal = {
    name: p?.principalName ?? schoolInfo.principal.name,
    title: p?.principalTitle ?? schoolInfo.principal.title,
    greeting: p?.principalGreeting ?? schoolInfo.principal.greeting,
    vision: p?.principalVision ?? schoolInfo.principal.vision,
    mission: p?.principalMission ?? schoolInfo.principal.mission,
    accreditation: p?.accreditation ?? schoolInfo.principal.accreditation,
    photo: p?.principalPhotoUrl ?? schoolInfo.principal.photo,
  };

  return (
    <section id="profil" className="section-padding relative bg-white dark:bg-secondary-dark">
      <div className="container-custom">
        <SectionHeading
          badge="Profil"
          title="Sambutan Kepala Madrasah"
          subtitle="Visi, misi, dan komitmen kami dalam mewujudkan madrasah digital modern."
          align="left"
        />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl shadow-premium">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:mx-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={principal.photo}
                    alt={principal.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary-dark/90 to-transparent p-6">
                  <p className="font-display text-lg font-bold text-white">
                    {principal.name}
                  </p>
                  <p className="text-sm text-teal-200">{principal.title}</p>
                </div>
              </div>
              <div className="absolute -right-2 -top-2 flex animate-bounce-soft items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-white shadow-lg sm:-right-6">
                <Award className="h-5 w-5" />
                <span className="text-sm font-bold">Akreditasi A</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="glass-card p-6 sm:p-8">
              <Quote className="mb-4 h-10 w-10 text-primary/30" />
              <p className="text-base leading-relaxed text-slate-700 dark:text-teal-100/90 sm:text-lg">
                {principal.greeting}
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-secondary-dark dark:text-white">
                    Visi
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-teal-200/80">
                    {principal.vision}
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-secondary-dark dark:text-white">
                    Misi
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {principal.mission.map((item: string) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-slate-600 dark:text-teal-200/80"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 dark:border-teal-600/30 dark:bg-teal-900/40">
                  <Award className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-teal-300">
                      Status Akreditasi
                    </p>
                    <p className="font-display font-bold text-secondary-dark dark:text-white">
                      {principal.accreditation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
