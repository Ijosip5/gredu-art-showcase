import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { WorkWithRelations } from "@/types/database";

export function KaryaCard({ karya }: { karya: WorkWithRelations }) {
  const image =
    karya.thumbnail_url ??
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800";

  return (
    <Link
      to="/karya/$id"
      params={{ id: karya.id }}
      className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-smooth hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={`Pratinjau karya ${karya.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-smooth group-hover:scale-110"
        />
        {karya.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
            {karya.category.name}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold leading-snug transition-smooth group-hover:text-primary">
          {karya.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {karya.participant?.name ?? "—"}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Lihat detail <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
