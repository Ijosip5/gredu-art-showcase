import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedWorks } from "@/data/karya";
import { supabase } from "@/lib/supabase";
import { KaryaCard } from "@/components/KaryaCard";
import type { CategoryRow } from "@/types/database";

export const Route = createFileRoute("/karya/")(({
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
}) as any);

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-border bg-card">
      <div className="aspect-[4/3] rounded-t-3xl bg-muted" />
      <div className="p-5 space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}

function GalleryPage() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");

  const { data: works = [], isLoading: worksLoading } = useQuery({
    queryKey: ["published-works"],
    queryFn: fetchPublishedWorks,
    staleTime: 1000 * 60 * 5,
  });

  const { data: categories = [] } = useQuery<CategoryRow[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return works.filter((k) => {
      const matchCat = categoryId === "all" || k.category_id === categoryId;
      const matchQuery =
        !q ||
        k.title.toLowerCase().includes(q) ||
        (k.participant?.name ?? "").toLowerCase().includes(q) ||
        (k.description ?? "").toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, categoryId, works]);

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
            id="gallery-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, kreator, atau deskripsi karya..."
            aria-label="Cari karya"
            className="w-full rounded-2xl border border-input bg-background py-3 pl-11 pr-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="mr-1 h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => setCategoryId("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-smooth ${
              categoryId === "all"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryId(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-smooth ${
                categoryId === c.id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {worksLoading ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
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
        </>
      )}
    </main>
  );
}
