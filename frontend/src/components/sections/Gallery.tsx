import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import type { GalleryDisplayImage } from "@/types/public";
import { GalleryGrid } from "./GalleryGrid";

interface GalleryProps {
  images: GalleryDisplayImage[];
}

export function Gallery({ images }: GalleryProps) {
  if (images.length === 0) return null;

  return (
    <section id="galeri" className="section-padding bg-white dark:bg-secondary-dark">
      <div className="container-custom">
        <SectionHeading
          badge="Galeri"
          title="Galeri Kegiatan"
          subtitle="Momen kegiatan belajar, prestasi, dan pembinaan karakter siswa."
        />
        <GalleryGrid images={images} />
        <div className="mt-10 flex justify-center">
          <Button href="/galeri" variant="primary">
            Lihat semua foto Galeri
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
