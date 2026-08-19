import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES, MOCK_KARYA } from "@/data/karya";
import { KaryaCard } from "@/components/KaryaCard";

export const Route = createFileRoute("/karya/")({
  head: () => ({
    meta: [
      { title: "Galeri Karya — Gredupedia 2026" },
      {
        name: "description",
        content:
          "Jelajahi seluruh karya mahasiswa Teknologi Pendidikan UNY: media pembelajaran, video animasi, desain grafis, dan game edukasi.",
      },
      { property: "og:title", content: "Galeri Karya — Gredupedia 2026" },
      {
        property: "og:description",
        content: "Cari dan saring karya pameran digital Gredupedia 2026 berdasarkan kategori.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Semua");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_KARYA.filter((k) => {
      const matchCat = category === "Semua" || k.category === category;
      const matchQuery =
        !q ||
        k.title.toLowerCase().includes(q) ||
        k.creator.toLowerCase().includes(q) ||
        k.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, category]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary-foreground">
        Showcase
      </span>
      <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
        Galeri <span className="text-gradient">Karya</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Kumpulan karya mahasiswa Teknologi Pendidikan UNY yang dipamerkan pada Gredupedia 2026.
        Gunakan pencarian dan filter untuk menemukan karya favoritmu.
      </p>

      <div className="mt-8 rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, kreator, atau deskripsi karya..."
            aria-label="Cari karya"
            className="w-full rounded-2xl border border-input bg-background py-3 pl-11 pr-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="mr-1 h-4 w-4 text-muted-foreground" />
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-smooth ${
                category === c
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Menampilkan <span className="font-semibold text-foreground">{results.length}</span> karya
      </p>

      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((k) => (
          <KaryaCard key={k.id} karya={k} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg font-semibold">Karya tidak ditemukan</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba kata kunci lain atau pilih kategori "Semua".
          </p>
        </div>
      )}
    </main>
  );
}
