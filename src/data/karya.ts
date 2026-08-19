export type Karya = {
  id: string;
  title: string;
  creator: string;
  category: string;
  media: string;
  image: string;
  description: string;
  goals: string;
  featured: boolean;
  externalLink: string;
};

export const CATEGORIES = [
  "Semua",
  "Media Pembelajaran",
  "Video & Animasi",
  "Desain Grafis",
  "Game Edukasi",
] as const;

export const MOCK_KARYA: Karya[] = [
  {
    id: "gredu-01",
    title: "EcoQuest: Game Edukasi Lingkungan Interaktif",
    creator: "Rian Kurniawan & Tim",
    category: "Game Edukasi",
    media: "Unity, C#, Aseprite",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
    description:
      "Sebuah game petualangan 2D RPG yang dirancang untuk mengajarkan anak-anak sekolah dasar tentang pentingnya memilah sampah dan menjaga ekosistem sungai secara interaktif. Pemain menyusuri lima level dengan tantangan pemilahan sampah, kuis reflektif, dan misi restorasi sungai.",
    goals:
      "Meningkatkan literasi lingkungan siswa kelas 4–6 SD melalui pendekatan game-based learning yang terukur lewat skor pre-test dan post-test dalam game.",
    featured: true,
    externalLink: "https://example.com/ecoquest-demo",
  },
  {
    id: "gredu-02",
    title: "EduVR: Pengenalan Tata Surya berbasis Virtual Reality",
    creator: "Siti Rahmawati",
    category: "Media Pembelajaran",
    media: "Blender, WebXR, Three.js",
    image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200",
    description:
      "Media pembelajaran imersif yang membawa siswa menjelajahi planet-planet di tata surya menggunakan teknologi VR Cardboard dengan visualisasi 3D yang akurat, lengkap dengan narasi audio dan mode eksplorasi bebas.",
    goals:
      "Menghadirkan pengalaman belajar astronomi yang konkret bagi siswa SMP dengan biaya perangkat rendah.",
    featured: true,
    externalLink: "https://example.com/eduvr-web",
  },
  {
    id: "gredu-03",
    title: "Infografis Interaktif Sejarah Candi Prambanan",
    creator: "Budi Santoso",
    category: "Desain Grafis",
    media: "Figma, Adobe Illustrator",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200",
    description:
      "Desain infografis modern berseri yang menceritakan relief candi Prambanan secara visual dengan pendekatan micro-learning yang mudah dicerna gen-Z, dilengkapi sistem warna dan tipografi yang konsisten.",
    goals:
      "Mengemas materi sejarah lokal menjadi konten visual yang layak dibagikan di media sosial pelajar.",
    featured: false,
    externalLink: "https://example.com/prambanan-design",
  },
  {
    id: "gredu-04",
    title: "Motion Graphic: Siklus Air untuk Kelas Inklusi",
    creator: "Alya Nur Fadhilah & Tim",
    category: "Video & Animasi",
    media: "After Effects, Illustrator",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200",
    description:
      "Video animasi 2D berdurasi 4 menit yang menjelaskan siklus air dengan narasi lambat, subtitle besar, dan bahasa isyarat pendamping agar ramah bagi siswa dengan hambatan pendengaran.",
    goals:
      "Menyediakan media ajar IPA yang aksesibel dan inklusif untuk kelas heterogen di sekolah dasar.",
    featured: true,
    externalLink: "https://example.com/siklus-air",
  },
  {
    id: "gredu-05",
    title: "Kelasku: LMS Ringan untuk Sekolah Daerah 3T",
    creator: "Fajar Ramadhan",
    category: "Media Pembelajaran",
    media: "React, Tailwind, Supabase",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
    description:
      "Learning Management System super ringan yang tetap berjalan pada koneksi 2G dengan mode offline-first, sinkronisasi tugas otomatis, dan antarmuka satu tangan untuk perangkat entry-level.",
    goals:
      "Menjembatani kesenjangan akses pembelajaran daring pada sekolah di daerah tertinggal, terdepan, dan terluar.",
    featured: true,
    externalLink: "https://example.com/kelasku",
  },
  {
    id: "gredu-06",
    title: "AksaraKu: Game Literasi Aksara Jawa",
    creator: "Dewi Larasati & Tim",
    category: "Game Edukasi",
    media: "Godot, GDScript",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200",
    description:
      "Game puzzle menulis aksara Jawa dengan sistem stroke recognition sederhana, papan peringkat kelas, dan mode duel antar siswa untuk meningkatkan motivasi belajar.",
    goals:
      "Melestarikan literasi aksara Jawa lewat mekanik permainan yang kompetitif namun tetap reflektif.",
    featured: false,
    externalLink: "https://example.com/aksaraku",
  },
  {
    id: "gredu-07",
    title: "Dokumenter Pendek: Guru di Lereng Merapi",
    creator: "Ilham Prasetya",
    category: "Video & Animasi",
    media: "Premiere Pro, DaVinci Resolve",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200",
    description:
      "Film dokumenter 8 menit yang merekam praktik pembelajaran adaptif para guru di kawasan rawan bencana, digunakan sebagai bahan diskusi mata kuliah Difusi Inovasi Pendidikan.",
    goals:
      "Menjadi bahan refleksi calon guru mengenai kontekstualisasi pembelajaran di wilayah rawan bencana.",
    featured: false,
    externalLink: "https://example.com/dokumenter-merapi",
  },
  {
    id: "gredu-08",
    title: "Poster Seri Kampanye Digital Wellbeing",
    creator: "Nadia Puspita",
    category: "Desain Grafis",
    media: "Figma, Photoshop",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200",
    description:
      "Sepuluh poster kampanye tentang keseimbangan penggunaan gawai bagi remaja, dirancang dengan sistem grid modular sehingga mudah diadaptasi sekolah lain.",
    goals:
      "Menumbuhkan kesadaran digital wellbeing di lingkungan SMA melalui bahasa visual yang dekat dengan remaja.",
    featured: false,
    externalLink: "https://example.com/digital-wellbeing",
  },
  {
    id: "gredu-09",
    title: "LabSim: Simulator Praktikum Kimia Virtual",
    creator: "Tim Laboratorium TP UNY",
    category: "Media Pembelajaran",
    media: "Unity WebGL, C#",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200",
    description:
      "Simulator praktikum kimia berbasis web yang memungkinkan siswa mencampur reagen secara aman, dengan umpan balik kesalahan prosedur secara real-time.",
    goals:
      "Memberikan pengalaman praktikum bagi sekolah yang tidak memiliki laboratorium kimia memadai.",
    featured: false,
    externalLink: "https://example.com/labsim",
  },
];

export const getKaryaById = (id: string) => MOCK_KARYA.find((k) => k.id === id);
