import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialsCarousel } from "./TestimonialsCarousel";
import type { TestimonialSectionData } from "@/types/public";

export function AlumniTestimonials({ section }: { section: TestimonialSectionData }) {
  if (section.items.length === 0) return null;

  return (
    <section
      id="testimoni-alumni"
      className="section-padding relative bg-slate-50 dark:bg-teal-950/40"
    >
      <div className="container-custom">
        <SectionHeading
          badge={section.badge}
          title={section.title}
          subtitle={section.subtitle}
        />
        <TestimonialsCarousel testimonials={section.items} />
      </div>
    </section>
  );
}
