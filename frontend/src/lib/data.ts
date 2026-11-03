export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const navLinks: NavLink[] = [
  { label: "Beranda", href: "/#beranda" },
  {
    label: "Profil",
    href: "/#profil",
    children: [
      { label: "Profil Sekolah", href: "/#profil" },
      { label: "Struktur Organisasi", href: "/struktur-organisasi" },
    ],
  },
  { label: "Layanan", href: "/#layanan" },
  { label: "Pengaduan", href: "/pengaduan" },
  { label: "Berita", href: "/#berita" },
  { label: "Prestasi", href: "/#prestasi" },
  { label: "Galeri", href: "/galeri" },
  { label: "Testimoni", href: "/#testimoni-alumni" },
  { label: "FAQ", href: "/#faq" },
  { label: "Zona Integritas", href: "/#zona-integritas" },
  { label: "Kontak", href: "/#kontak" },
];

export interface StatItemData {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
}

export const schoolStats: StatItemData[] = [
  { label: "Siswa Aktif", value: 1248, icon: "users" },
  { label: "Tenaga Pendidik", value: 86, icon: "graduation-cap" },
  { label: "Prestasi", value: 320, suffix: "+", icon: "trophy" },
  { label: "Ruang Kelas", value: 36, icon: "building" },
];

export const heroFloatingStats = [
  { label: "Akreditasi", value: "A", sub: "Terakreditasi" },
  { label: "Siswa", value: "1.2K+", sub: "Aktif Belajar" },
  { label: "Prestasi", value: "320+", sub: "Tingkat Nasional" },
];

export const digitalServices = [
  {
    title: "PTSP",
    description: "Layanan terpadu satu pintu digital untuk administrasi sekolah.",
    icon: "clipboard-list",
    href: "#",
    color: "from-primary to-primary-700",
  },
  {
    title: "PPDB",
    description: "Penerimaan peserta didik baru secara online dan transparan.",
    icon: "graduation-cap",
    href: "#",
    color: "from-accent to-accent-dark",
  },
  {
    title: "CBT",
    description: "Ujian berbasis komputer dengan sistem keamanan terintegrasi.",
    icon: "monitor",
    href: "#",
    color: "from-teal-600 to-secondary",
  },
  {
    title: "E-Learning",
    description: "Pembelajaran daring interaktif dengan materi multimedia.",
    icon: "laptop",
    href: "#",
    color: "from-emerald-500 to-primary",
  },
  {
    title: "E-Rapor",
    description: "Rapor digital real-time untuk siswa, orang tua, dan guru.",
    icon: "book-open",
    href: "#",
    color: "from-primary-500 to-teal-700",
  },
  {
    title: "Perpustakaan",
    description: "Katalog digital dan peminjaman buku secara online.",
    icon: "library",
    href: "#",
    color: "from-secondary to-secondary-dark",
  },
];

export const newsItems = [
  {
    id: 1,
    title: "MAN 2 Madiun Raih Juara 1 Olimpiade Sains Nasional Tingkat Provinsi",
    excerpt:
      "Tim siswa berhasil membawa pulang medali emas di bidang matematika dan fisika.",
    category: "Prestasi",
    date: "18 Mei 2026",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  },
  {
    id: 2,
    title: "Peluncuran Platform Madrasah Digital Terintegrasi",
    excerpt:
      "Sekolah resmi meluncurkan ekosistem layanan digital untuk mendukung pembelajaran modern.",
    category: "Teknologi",
    date: "12 Mei 2026",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
  },
  {
    id: 3,
    title: "Kegiatan Pesantren Kilat Ramadhan 1447 H",
    excerpt:
      "Program pembinaan karakter dan keagamaan diikuti seluruh siswa selama satu minggu.",
    category: "Kegiatan",
    date: "5 Mei 2026",
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
  },
];

export const achievements = [
  { title: "Juara 1 OSN Provinsi", year: 2026, level: "Provinsi" },
  { title: "Sekolah Adiwiyata Nasional", year: 2025, level: "Nasional" },
  { title: "Juara 2 LKS Kabupaten", year: 2025, level: "Kabupaten" },
  { title: "Best Digital Madrasah", year: 2024, level: "Nasional" },
  { title: "Juara 1 Paskibra Kota", year: 2024, level: "Kota" },
  { title: "Akreditasi A", year: 2024, level: "BAN-S/M" },
];

export const achievementCounters = [
  { label: "Prestasi Nasional", value: 48 },
  { label: "Prestasi Provinsi", value: 112 },
  { label: "Prestasi Kota", value: 160 },
];

export const fallbackFaqs = [
  {
    question: "Bagaimana cara mendaftar PPDB di MAN 2 Kota Madiun?",
    answer:
      "Pendaftaran PPDB dilakukan secara online melalui portal resmi madrasah. Calon siswa mengisi formulir, mengunggah berkas, dan mengikuti seleksi sesuai jadwal yang ditetapkan.",
    category: "PPDB",
  },
  {
    question: "Apa saja fasilitas yang tersedia di madrasah?",
    answer:
      "MAN 2 Kota Madiun dilengkapi laboratorium IPA, laboratorium komputer, perpustakaan digital, ruang multimedia, masjid, dan fasilitas olahraga.",
    category: "Umum",
  },
  {
    question: "Apakah tersedia program unggulan?",
    answer:
      "Ya, madrasah memiliki program unggulan seperti tahfidz Al-Quran, olimpiade sains, digital learning, dan pengembangan karakter kepemimpinan.",
    category: "Akademik",
  },
];

export const fallbackTestimonials = [
  {
    name: "Ahmad Rizki Pratama",
    graduationYear: 2022,
    occupation: "Mahasiswa Teknik Informatika ITB",
    quote:
      "MAN 2 Madiun memberikan fondasi akademik dan karakter yang kuat. Saya merasa siap menghadapi perkuliahan berkat bimbingan guru-guru yang peduli.",
    photoUrl: null,
  },
  {
    name: "Siti Nurhaliza",
    graduationYear: 2021,
    occupation: "Dokter Gigi, Universitas Airlangga",
    quote:
      "Lingkungan belajar yang kondusif dan program olimpiade sains membuka banyak peluang. Terima kasih MAN 2 Madiun!",
    photoUrl: null,
  },
  {
    name: "Muhammad Fadli",
    graduationYear: 2023,
    occupation: "Pengusaha Digital",
    quote:
      "Program digital learning di madrasah ini membuat saya percaya diri membangun startup sendiri sejak kuliah.",
    photoUrl: null,
  },
];

export const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
    alt: "Gedung sekolah MAN 2 Madiun",
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80",
    alt: "Kegiatan belajar siswa",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
    alt: "Upacara bendera",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3c?w=400&q=80",
    alt: "Laboratorium komputer",
    span: "col-span-1 row-span-2",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&q=80",
    alt: "Ekstrakurikuler",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80",
    alt: "Perpustakaan sekolah",
    span: "col-span-2 row-span-1",
  },
];

export const footerQuickLinks = [
  { label: "Profil Sekolah", href: "#profil" },
  { label: "Visi & Misi", href: "#profil" },
  { label: "PPDB Online", href: "#" },
  { label: "PTSP Digital", href: "/#layanan" },
  { label: "Layanan Pengaduan", href: "/pengaduan" },
  { label: "Berita", href: "/#berita" },
  { label: "Galeri", href: "/galeri" },
  { label: "Struktur Organisasi", href: "/struktur-organisasi" },
  { label: "FAQ", href: "#faq" },
  { label: "Testimoni Alumni", href: "#testimoni-alumni" },
];

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

export const schoolInfo = {
  name: "MAN 2 Kota Madiun",
  tagline: "Madrasah Digital Modern Berprestasi",
  address: "Jl. Raya Taman No. 1, Taman, Madiun, Jawa Timur 63131",
  phone: "(0351) 1234567",
  email: "info@man2madiun.sch.id",
  hours: "Senin – Jumat: 07.00 – 15.30 WIB",
  principal: {
    name: "Dr. H. Ahmad Fauzi, M.Pd.",
    title: "Kepala Madrasah",
    greeting:
      "Assalamu'alaikum warahmatullahi wabarakatuh. Selamat datang di website resmi MAN 2 Kota Madiun. Kami berkomitmen membentuk generasi Qur'ani yang unggul dalam prestasi akademik, berakhlak mulia, dan mahir dalam teknologi digital.",
    vision:
      "Menjadi madrasah unggul yang menghasilkan lulusan beriman, berilmu, berprestasi, dan berwawasan digital global.",
    mission: [
      "Menyelenggarakan pendidikan berkualitas berbasis teknologi",
      "Mengembangkan karakter Islami dan kepemimpinan siswa",
      "Membangun ekosistem layanan digital terintegrasi",
      "Menjalin kemitraan strategis dengan dunia industri dan perguruan tinggi",
    ],
    accreditation: "Terakreditasi A (BAN-S/M)",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
};
