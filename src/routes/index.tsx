import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Instagram,
  MapPin,
  Navigation,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { MOCK_KARYA } from "@/data/karya";
import { KaryaCard } from "@/components/KaryaCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gredupedia 2026 — Pameran Digital Teknologi Pendidikan UNY" },
      {
        name: "description",
        content:
          "Gredupedia 2026: pameran digital & showcase portofolio mahasiswa Teknologi Pendidikan UNY. 31 Agustus 2026, Sleman, Yogyakarta.",
      },
      { property: "og:title", content: "Gredupedia 2026 — Pameran Digital TP UNY" },
      {
        property: "og:description",
        content:
          "Jelajahi karya media pembelajaran, animasi, desain, dan game edukasi mahasiswa TP UNY.",
      },
    ],
  }),
  component: Home,
});

const AGENDA = [
  {
    time: "08.00",
    title: "Opening Ceremony",
    desc: "Pembukaan resmi Gredupedia 2026 bersama Dekan FIPP dan dosen Teknologi Pendidikan, dilanjutkan tur kurator ke seluruh zona pameran.",
  },
  {
    time: "10.00",
    title: "Seminar EdTech",
    desc: "Diskusi bertema 'AI & Desain Pembelajaran Adaptif' bersama praktisi industri dan alumni TP UNY.",
  },
  {
    time: "13.00",
    title: "Live Showcase",
    desc: "Demonstrasi langsung karya mahasiswa: uji coba game edukasi, VR tata surya, hingga LMS ringan bagi sekolah 3T.",
  },
  {
    time: "16.00",
    title: "Workshop Kreator",
    desc: "Kelas singkat produksi motion graphic pembelajaran dan prototyping media interaktif dengan Figma.",
  },
  {
    time: "19.00",
    title: "Awarding Night",
    desc: "Penganugerahan karya terbaik lintas kategori, ditutup dengan penampilan kolaborasi seni mahasiswa.",
  },
];

const DOKUMENTASI = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=900",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=900",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=900",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=900",
];

function Home() {
  const [active, setActive] = useState(0);
  const featured = MOCK_KARYA.filter((k) => k.featured).slice(0, 4);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grain-dots absolute inset-0 opacity-60" aria-hidden />
        <div className="gradient-hero absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Digital Exhibition · Edisi Ketiga
          </span>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.05] sm:text-7xl">
            Gredupedia <span className="text-gradient">2026</span>
            <br />
            Panggung Karya Teknologi Pendidikan.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Pameran digital tahunan mahasiswa Teknologi Pendidikan UNY — merayakan media
            pembelajaran, animasi, desain, dan game edukasi yang lahir dari riset dan empati.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/karya"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lift"
            >
              Jelajahi Karya <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#program"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 font-semibold transition-smooth hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              Lihat Rundown Acara
            </a>
          </div>

          <dl className="mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              { icon: CalendarDays, label: "Tanggal", value: "31 Agustus 2026" },
              { icon: MapPin, label: "Lokasi", value: "Sleman, Yogyakarta" },
              { icon: Users, label: "Penyelenggara", value: "Teknologi Pendidikan UNY" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-lift"
              >
                <Icon className="h-5 w-5 text-accent" />
                <dt className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 font-display font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Tentang</span>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight">
              Bukan sekadar pameran, tapi ruang uji gagasan pendidikan.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Gredupedia lahir dari keyakinan bahwa teknologi pendidikan bukan hanya soal perangkat,
              melainkan soal manusia yang belajar. Setiap tahun, mahasiswa Teknologi Pendidikan UNY
              memamerkan hasil riset, prototipe, dan produk media pembelajaran yang telah diuji di
              sekolah mitra.
            </p>
            <p className="mt-4 text-muted-foreground">
              Edisi 2026 mengusung tema <strong className="text-foreground">"Learning by Design"</strong>
              , menghadirkan puluhan karya lintas kategori, seminar EdTech, hingga malam apresiasi
              karya terbaik.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["40+", "Karya dipamerkan"],
                ["12", "Sekolah mitra"],
                ["800+", "Pengunjung"],
              ].map(([n, l]) => (
                <div key={l} className="rounded-2xl bg-secondary p-4">
                  <p className="font-display text-3xl font-bold text-primary">{n}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200"
              alt="Suasana kelas dan kolaborasi mahasiswa Teknologi Pendidikan"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lift"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-3xl border border-border bg-card p-5 shadow-lift sm:block">
              <p className="font-display text-sm font-bold">Learning by Design</p>
              <p className="text-xs text-muted-foreground">Tema Gredupedia 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Program</span>
          <h2 className="mt-4 font-display text-4xl font-bold">Rundown Acara</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Klik setiap agenda untuk melihat deskripsi singkatnya.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <ol className="space-y-3">
              {AGENDA.map((a, i) => (
                <li key={a.title}>
                  <button
                    onClick={() => setActive(i)}
                    className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-smooth ${
                      active === i
                        ? "border-primary bg-card shadow-lift"
                        : "border-border bg-card/60 hover:-translate-y-0.5 hover:shadow-soft"
                    }`}
                  >
                    <span
                      className={`rounded-xl px-3 py-1.5 font-display text-sm font-bold ${
                        active === i
                          ? "gradient-accent text-accent-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {a.time}
                    </span>
                    <span className="font-display font-semibold">{a.title}</span>
                    <ArrowRight
                      className={`ml-auto h-4 w-4 transition-smooth ${
                        active === i ? "translate-x-0 text-primary" : "-translate-x-2 opacity-0"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ol>

            <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
                {AGENDA[active]?.time} WIB
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold">{AGENDA[active]?.title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{AGENDA[active]?.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Auditorium FIPP UNY, Karangmalang
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED KARYA */}
      <section id="karya" className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Karya</span>
            <h2 className="mt-4 font-display text-4xl font-bold">Karya Pilihan Kurator</h2>
          </div>
          <Link
            to="/karya"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-semibold transition-smooth hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            Lihat Semua Karya
            <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((k) => (
            <KaryaCard key={k.id} karya={k} />
          ))}
        </div>
      </section>

      {/* DOKUMENTASI */}
      <section id="dokumentasi" className="bg-ink py-20 text-background">
        <div className="mx-auto max-w-6xl px-5">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-highlight">
            Dokumentasi
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold">Momen dari Panggung Kami</h2>
          <p className="mt-3 max-w-xl text-background/70">
            Cuplikan suasana pameran edisi sebelumnya dan persiapan Gredupedia 2026.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <a
              href="https://www.instagram.com/reel/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative col-span-1 overflow-hidden rounded-3xl md:col-span-2 md:row-span-2"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                poster="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200"
                className="h-full min-h-[280px] w-full object-cover transition-smooth group-hover:scale-105 group-hover:brightness-50 md:min-h-[420px]"
              >
                <source
                  src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 to-transparent p-6">
                <div>
                  <p className="font-display text-xl font-bold">Aftermovie Gredupedia</p>
                  <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-background/95 px-4 py-2 text-sm font-semibold text-foreground opacity-0 transition-smooth group-hover:opacity-100">
                    <Instagram className="h-4 w-4" /> Tonton di Instagram ↗
                  </span>
                </div>
              </div>
            </a>

            {DOKUMENTASI.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-3xl">
                <img
                  src={src}
                  alt={`Dokumentasi pameran Gredupedia ${i + 1}`}
                  loading="lazy"
                  className="h-44 w-full object-cover transition-smooth hover:scale-110 md:h-[202px]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOKASI */}
      <section id="lokasi" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Lokasi</span>
            <h2 className="mt-4 font-display text-4xl font-bold">Sampai Jumpa di Yogyakarta</h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                Auditorium FIPP, Universitas Negeri Yogyakarta, Jl. Colombo No.1, Karangmalang,
                Depok, Sleman, DIY 55281
              </p>
              <p className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary" /> Senin, 31 Agustus 2026 · 08.00 –
                21.00 WIB
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" /> +62 812-0000-2026 (Panitia Gredupedia)
              </p>
            </div>
          </div>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Universitas+Negeri+Yogyakarta"
            target="_blank"
            rel="noopener noreferrer"
            className="group gradient-hero relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 text-primary-foreground shadow-lift transition-smooth hover:-translate-y-1"
          >
            <div className="grain-dots absolute inset-0 opacity-10" aria-hidden />
            <Navigation className="h-10 w-10" />
            <div className="mt-16">
              <p className="font-display text-2xl font-bold">Buka Rute di Google Maps</p>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Dapatkan petunjuk arah langsung menuju lokasi pameran.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-background/15 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-smooth group-hover:bg-background/25">
                Lihat Peta <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
