import { MapPin, Phone, Mail, Clock, GraduationCap } from "lucide-react";
import { schoolInfo, footerQuickLinks } from "@/lib/data";
import type { SchoolProfile } from "@/types/public";

interface FooterProps {
  profile?: SchoolProfile;
}

export function Footer({ profile }: FooterProps) {
  const info = profile ?? {
    name: schoolInfo.name,
    tagline: schoolInfo.tagline,
    address: schoolInfo.address,
    phone: schoolInfo.phone,
    email: schoolInfo.email,
    hours: schoolInfo.hours,
    social: [],
    principalName: "",
    principalTitle: "",
    principalGreeting: "",
    principalVision: "",
    principalMission: [],
    accreditation: "",
  };

  const social = profile?.social?.length
    ? profile.social
    : [
        { label: "Instagram", href: "https://instagram.com" },
        { label: "YouTube", href: "https://youtube.com" },
        { label: "Facebook", href: "https://facebook.com" },
        { label: "TikTok", href: "https://tiktok.com" },
      ];

  return (
    <footer id="kontak" className="relative bg-secondary-dark text-teal-100">
      <div className="islamic-pattern absolute inset-0 opacity-20" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="container-custom section-padding relative pb-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <a href="#beranda" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-white">
                  {info.name}
                </p>
                <p className="text-xs text-teal-300/80">{info.tagline}</p>
              </div>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-teal-200/70">
              Madrasah Aliyah Negeri unggulan dengan konsep pendidikan digital
              modern dan berlandaskan nilai-nilai Islam.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-teal-700/50 bg-teal-900/40 px-4 py-2 text-xs font-semibold transition hover:border-accent/50 hover:bg-accent/20 hover:text-accent-light"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-bold text-white">Tautan Cepat</h4>
            <ul className="mt-4 space-y-2">
              {footerQuickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-teal-200/70 transition hover:text-accent-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display font-bold text-white">Kontak</h4>
            <ul className="mt-4 space-y-4">
              <li className="flex gap-3 text-sm">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-teal-200/70">{info.address}</span>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <a href={`tel:${info.phone}`} className="hover:text-white">
                  {info.phone}
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <a href={`mailto:${info.email}`} className="hover:text-white">
                  {info.email}
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <Clock className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-teal-200/70">{info.hours}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display font-bold text-white">Lokasi</h4>
            <div className="mt-4 overflow-hidden rounded-2xl border border-teal-700/40 shadow-premium">
              <iframe
                title="Peta MAN 2 Kota Madiun"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4865.760680414789!2d111.53166987588455!3d-7.640495475576555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79be8e241a8fa1%3A0xba21892382d59368!2sMadrasah%20Aliyah%20Negeri%202%20Kota%20Madiun!5e1!3m2!1sid!2sid!4v1781860043128!5m2!1sid!2sid"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[30%] contrast-[1.1] transition hover:grayscale-0"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-teal-800/60 pt-8 text-center text-xs text-teal-400/70 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} {info.name}. Hak cipta dilindungi.</p>
          <p>Madrasah Digital Modern — Dibangun dengan teknologi terkini</p>
        </div>
      </div>
    </footer>
  );
}
