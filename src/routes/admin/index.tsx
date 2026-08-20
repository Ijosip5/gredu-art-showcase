import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ImageIcon, Users, Tag, TrendingUp, Clock, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")(({
  head: () => ({ meta: [{ title: "Dashboard — Admin Gredupedia" }] }),
  component: AdminDashboard,
}) as any);

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="mt-4 font-display text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm font-medium">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [worksRes, participantsRes, categoriesRes, publishedRes, featuredRes] =
        await Promise.all([
          supabase.from("works").select("id", { count: "exact" }),
          supabase.from("participants").select("id", { count: "exact" }),
          supabase.from("categories").select("id", { count: "exact" }),
          supabase.from("works").select("id", { count: "exact" }).eq("status", "published"),
          supabase.from("works").select("id", { count: "exact" }).eq("is_featured", true),
        ]);
      return {
        works: worksRes.count ?? 0,
        participants: participantsRes.count ?? 0,
        categories: categoriesRes.count ?? 0,
        published: publishedRes.count ?? 0,
        featured: featuredRes.count ?? 0,
      };
    },
    staleTime: 1000 * 30,
  });

  const { data: recentWorks = [] } = useQuery({
    queryKey: ["admin-recent-works"],
    queryFn: async () => {
      const { data } = await supabase
        .from("works")
        .select(`*, participant:participants(name), category:categories(name)`)
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
    staleTime: 1000 * 30,
  });

  const statusColor: Record<string, string> = {
    published: "bg-highlight/20 text-highlight-foreground",
    draft: "bg-secondary text-secondary-foreground",
    archived: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Selamat datang di panel pengelola Gredupedia.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon={ImageIcon}
          label="Total Karya"
          value={stats?.works ?? "—"}
          color="bg-primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Dipublikasi"
          value={stats?.published ?? "—"}
          color="bg-highlight-foreground"
        />
        <StatCard
          icon={Star}
          label="Unggulan"
          value={stats?.featured ?? "—"}
          color="bg-accent"
        />
        <StatCard
          icon={Users}
          label="Peserta"
          value={stats?.participants ?? "—"}
          color="bg-destructive"
        />
        <StatCard
          icon={Tag}
          label="Kategori"
          value={stats?.categories ?? "—"}
          color="bg-ring"
        />
      </div>

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { to: "/admin/karya/tambah", label: "Tambah Karya Baru", icon: ImageIcon },
          { to: "/admin/peserta/tambah", label: "Tambah Peserta", icon: Users },
          { to: "/admin/kategori", label: "Kelola Kategori", icon: Tag },
        ].map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 font-medium transition-smooth hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-soft"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>

      {/* Recent works */}
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display font-semibold">Karya Terbaru</h2>
          </div>
          <Link
            to="/admin/karya"
            className="text-xs font-medium text-primary hover:underline"
          >
            Lihat semua →
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentWorks.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              Belum ada karya. Mulai tambahkan karya pertama!
            </p>
          ) : (
            recentWorks.map((w: any) => (
              <div key={w.id} className="flex items-center gap-4 px-6 py-4">
                <img
                  src={
                    w.thumbnail_url ??
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100"
                  }
                  alt={w.title}
                  className="h-12 w-16 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{w.title}</p>
                  <p className="text-xs text-muted-foreground">{w.participant?.name ?? "—"}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[w.status] ?? ""}`}
                >
                  {w.status}
                </span>
                <Link
                  to="/admin/karya/$id/edit"
                  params={{ id: w.id }}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Edit
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
