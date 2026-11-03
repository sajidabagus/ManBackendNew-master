import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "./FaqAccordion";
import type { FaqSectionData } from "@/types/public";

export function FAQ({ section }: { section: FaqSectionData }) {
  if (section.items.length === 0) return null;

  return (
    <section id="faq" className="section-padding bg-white dark:bg-teal-950/20">
      <div className="container-custom">
        <SectionHeading
          badge={section.badge}
          title={section.title}
          subtitle={section.subtitle}
        />
        <FaqAccordion items={section.items} />
      </div>
    </section>
  );
}
