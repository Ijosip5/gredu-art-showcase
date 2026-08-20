# Gredupedia Showcase

You are an expert frontend developer. Build a modern, highly interactive, and responsive website for "Gredupedia 2026", which is a digital exhibition and portfolio showcase website organized by Educational Technology (Teknologi Pendidikan) students at UNY (Universitas Negeri Yogyakarta).

The website architecture uses a "Hybrid One-Page + Detail Page" approach. It must look professional, creative, clean, and vibrant, taking aesthetic cues from premium sports & arts event sites like Run'nShine (vibrant colors, clean cards, smooth transitions, great typography) but adapted for an educational technology exhibition.

Use React, Tailwind CSS, Lucide Icons, and React Router (Vite-based) for routing.

---

### 1. INFORMATION ARCHITECTURE & ROUTES
Implement the following routes:
- `/` - Home Page (The central hybrid landing page with multiple sections)
- `/karya` - Full Gallery / Showcase Page (Searchable, filterable grid of all student works)
- `/karya/:id` - Dynamic Detail Page for a specific work

---

### 2. DETAILED PAGE SPECIFICATIONS

#### A. HOME PAGE (`/`)
Implement a single-page scrolling experience containing these sequential sections:
1.  **Navbar (Sticky):** 
    - Clean brand logo "Gredupedia 2026".
    - Primary Navigation links (Scroll-to-section on Home page, or redirects if currently on another route): "Tentang", "Program", "Karya", "Dokumentasi".
    - CTA Button: "Eksplor Galeri" (Redirects to `/karya`).
2.  **Hero Section:**
    - High-impact, artsy & modern introduction of "Gredupedia 2026".
    - Key details: Date (e.g., "31 Agustus 2026"), Location (e.g., "Sleman, Yogyakarta"), and organizers ("Teknologi Pendidikan UNY").
    - Clear, beautiful CTA buttons to explore works or view the event rundown.
3.  **Tentang Section:**
    - Brief, engaging story/explanation about Gredupedia 2026 as a prestigious TP UNY exhibition.
4.  **Program / Agenda Section:**
    - A timeline/card-based rundown of the exhibition events (e.g., Opening, Seminar, Live Showcase, Awarding Night). Make it interactive (user can click cards to see quick description).
5.  **Featured Karya Section:**
    - A curated preview showcase (grid of 3-4 featured cards).
    - Each card shows: Cover Image, Title, Category tag, and Creator's Name.
    - CTA Button: "Lihat Semua Karya (Arrow Icon)" which routes to `/karya`.
6.  **Dokumentasi Preview Section:**
    - Visual grid showing photos/videos of current or past exhibitions.
    - Special Video Autoplay Card: Implement a video card that plays a video automatically on loop in a muted state. 
      * Interactive Hover Behavior: On hover, dim the video slightly and show an overlay text/button: "Tonton di Instagram ↗".
      * On Click: Open an external Instagram Reel URL in a new tab (`target="_blank"`).
7.  **Lokasi Section:**
    - Clean contact info, address, and physical exhibition location info.
    - Interactive Google Maps CTA Card/Button: Styled beautifully. When clicked, it opens a Google Maps direction link in a new tab.

#### B. GALLERY PAGE (`/karya`)
- A beautiful, clean page containing the full showcase.
- **Search Bar:** Real-time text search filtering through work titles, creator names, or descriptions.
- **Category Filter Tabs:** Interactive buttons/tabs to filter by media type (e.g., "Semua", "Media Pembelajaran", "Video & Animasi", "Desain Grafis", "Game Edukasi").
- **Karya Grid:** Dynamic grid displaying filtered work cards. On hover, the cards should scale slightly with smooth Tailwind transitions. Clicking a card routes the user to `/karya/:id`.

#### C. DETAIL KARYA PAGE (`/karya/:id`)
- A dedicated, immersive dynamic page displaying deep-dive information for a single work.
- It should dynamically parse the `:id` from the URL and pull data from the mock data array.
- Include a "Kembali ke Galeri" button that routes back to `/karya`.
- **Layout:** Two-column split layout on desktop (Media on left, Metadata & Description on right):
  * **Left Column:** High-quality project preview image or an embedded iframe (like YouTube or a mock website preview frame).
  * **Right Column:**
    * Work Title & Category Tag.
    * Creator's/Creator Team's Name.
    * "Media/Alat" Used: List of tools (e.g., Figma, Unity, Canva, React).
    * Rich text Description of the project, including goals and context.
    * CTA button: "Buka / Coba Karya ↗" (Simulating an external link to open the student's actual live project in a new tab).
- **Related Works Section:** Show 3 other works from the same category at the bottom of the page.

#### D. FOOTER (Global Footer on all pages)
- Secondary Navigation Map.
- "Ikuti Kami" social media links (Instagram, YouTube) opening in new tabs.
- **Archive Section:** An interactive dropdown or minimalist section displaying "Arsip Edisi Sebelumnya" containing "Gredupedia 2024" and "Gredupedia 2025" links (mocked as external links or simple routing alerts) to represent long-term archive architecture.

---

### 3. TECHNICAL SPECIFICATION & DATA MODEL
Provide a robust mock data array representing educational technology projects directly in the codebase so the website is immediately populated with realistic, high-fidelity data.

Mock Data Structure Example:
```javascript
const MOCK_KARYA = [
  {
    id: "gredu-01",
    title: "EcoQuest: Game Edukasi Lingkungan Interaktif",
    creator: "Rian Kurniawan & Tim",
    category: "Game Edukasi",
    media: "Unity, C#",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
    description: "Sebuah game petualangan 2D RPG yang dirancang untuk mengajarkan anak-anak sekolah dasar tentang pentingnya memilah sampah dan menjaga ekosistem sungai secara interaktif.",
    featured: true,
    externalLink: "https://example.com/ecoquest-demo"
  },
  {
    id: "gredu-02",
    title: "EduVR: Pengenalan Tata Surya berbasis Virtual Reality",
    creator: "Siti Rahmawati",
    category: "Media Pembelajaran",
    media: "Blender, WebXR",
    image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200",
    description: "Media pembelajaran imersif yang membawa siswa menjelajahi planet-planet di tata surya menggunakan teknologi VR Cardboard dengan visualisasi 3D yang akurat.",
    featured: true,
    externalLink: "https://example.com/eduvr-web"
  },
  {
    id: "gredu-03",
    title: "Infografis Interaktif Sejarah Candi Prambanan",
    creator: "Budi Santoso",
    category: "Desain Grafis",
    media: "Figma, Adobe Illustrator",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200",
    description: "Desain infografis modern berseri yang menceritakan relief candi Prambanan secara visual dengan pendekatan micro-learning yang mudah dicerna gen-Z.",
    featured: false,
    externalLink: "https://example.com/prambanan-design"
  }
];


Make sure the styling feels premium, utilizes smooth Framer Motion (or simple standard CSS transitions) for micro-interactions, is fully responsive across Mobile and Desktop, and adheres to strict web safety practices (all external links use rel="noopener noreferrer").


---

### **Mengapa Prompt Ini Sangat Efektif di Lovable?**
1. **Menghindari Bias Akademik yang Kaku:** Lovable dituntut untuk mengadopsi estetika dinamis layaknya *Run'nShine* (olahraga & seni), tetapi disesuaikan dengan substansi pameran mahasiswa Teknologi Pendidikan UNY [7-9].
2. **State Management Bawaan:** Prompt ini mendikte Lovable untuk langsung membuat fitur pencarian (*search bar*) dan filter kategori (*tabs*) yang fungsional di halaman `/karya` [4, 10].
3. **Mencegah Kerusakan Router:** Lovable akan mengimplementasikan React Router dengan aman karena struktur data `:id` dan transisi dari landing page menuju `/karya` serta detail halaman `/karya/:id` telah dispesifikasikan secara hierarkis [6, 11].
4. **Mock Data Realistis:** Lovable tidak akan memunculkan halaman kosong atau sekadar teks "Lorem Ipsum" karena kita sudah menyediakan struktur *mock data* proyek Teknologi Pendidikan yang riil di dalam prompt.

---

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://gredu-art-showcase.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/553d03d8-8075-4daf-a54e-5dd58ce5f4d1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
