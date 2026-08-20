import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Layers, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkById, fetchRelatedWorks } from "@/data/karya";
import { KaryaCard } from "@/components/KaryaCard";

export const Route = createFileRoute("/karya/$id")(({
  loader: async ({ params }: { params: { id: string } }) => {
    const karya = await fetchWorkById(params.id);
    if (!karya) throw notFound();
    return { karya };
  },
  head: ({ loaderData }: { loaderData?: { karya?: any } }) => {
    if (!loaderData || !loaderData.karya) {
      return {
        meta: [{ title: "Karya tidak ditemukan — Gredupedia 2026" }, { name: "robots", content: "noindex" }],
      };
    }
    const karya = loaderData.karya;
    return {
      meta: [
        { title: `${karya.title} — Gredupedia 2026` },
        { name: "description", content: (karya.description ?? "").slice(0, 155) },
        { property: "og:title", content: `${karya.title} — Gredupedia 2026` },
        { property: "og:description", content: (karya.description ?? "").slice(0, 155) },
        { property: "og:image", content: karya.thumbnail_url ?? "" },
        { name: "twitter:image", content: karya.thumbnail_url ?? "" },
      ],
    };
  },
  component: DetailPage,
}) as any);

function DetailPage() {
  const loaderData = Route.useLoaderData() as { karya: any };
  const karya = loaderData?.karya;

  const { data: related = [] } = useQuery({
    queryKey: ["related-works", karya?.category_id, karya?.id],
    queryFn: () =>
      karya?.category_id
        ? fetchRelatedWorks(karya.category_id, karya.id, 3)
        : Promise.resolve([]),
    staleTime: 1000 * 60 * 5,
    enabled: !!karya?.category_id,
  });

  if (!karya) return null;

  const mediaTools = karya.media_tools
    ? karya.media_tools.split(",").map((m: string) => m.trim())
    : [];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link
        to="/karya"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-smooth hover:-translate-y-0.5 hover:border-primary hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Galeri
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            {karya.external_link && (
              <div className="flex items-center gap-1.5 border-b border-border bg-secondary px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="h-2.5 w-2.5 rounded-full bg-highlight" />
                <span className="ml-3 truncate text-xs text-muted-foreground">
                  {karya.external_link}
                </span>
              </div>
            )}
            <img
              src={karya.thumbnail_url ?? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200"}
              alt={`Tampilan proyek ${karya.title}`}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              karya.category?.name ?? "—",
              karya.participant?.name?.split("&")[0]?.trim() ?? karya.participant?.name ?? "—",
              "Gredupedia 2026",
            ].map((t: string, i: number) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-3 text-center text-xs font-medium text-muted-foreground"
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="inline-flex rounded-full gradient-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-foreground">
            {karya.category?.name ?? "Karya"}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            {karya.title}
          </h1>

          <div className="mt-5 space-y-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Kreator:</span>
              <span className="font-semibold">{karya.participant?.name ?? "—"}</span>
            </p>
            {mediaTools.length > 0 && (
              <p className="flex items-start gap-3 text-sm">
                <Layers className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Media/Alat:</span>
                <span className="flex flex-wrap gap-1.5">
                  {mediaTools.map((m: string) => (
                    <span
                      key={m}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                    >
                      {m}
                    </span>
                  ))}
                </span>
              </p>
            )}
          </div>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            {karya.description && <p>{karya.description}</p>}
            {karya.goals && (
              <div className="rounded-2xl border-l-4 border-accent bg-secondary/60 p-4">
                <p className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                  Tujuan &amp; Konteks
                </p>
                <p className="mt-2">{karya.goals}</p>
              </div>
            )}
          </div>

          {karya.external_link && (
            <a
              href={karya.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lift"
            >
              Buka / Coba Karya <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold">Karya Serupa</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Karya lain dalam kategori {karya.category?.name}
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((k: any) => (
              <KaryaCard key={k.id} karya={k} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
