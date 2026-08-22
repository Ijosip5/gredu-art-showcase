import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ImageIcon,
  Users,
  Tag,
  TrendingUp,
  Clock,
  Star,
  Plus,
  Edit2,
  Trash2,
  StarOff,
  Archive,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { AddArtworkModal } from "@/components/admin/AddArtworkModal";

export const Route = createFileRoute("/admin/_shell/_shell/")(({
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
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lift">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="mt-4 font-display text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

const statusColor: Record<string, string> = {
  published: "bg-highlight/20 text-highlight-foreground",
  draft: "bg-secondary text-secondary-foreground",
  archived: "bg-muted text-muted-foreground",
};

function AdminDashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

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

  const { data: recentWorks = [], isLoading: worksLoading } = useQuery({
    queryKey: ["admin-recent-works"],
    queryFn: async () => {
      const { data } = await supabase
        .from("works")
        .select(`*, participant:participants(name), category:categories(name)`)
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
    staleTime: 1000 * 30,
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase
        .from("works")
        .update({ is_featured })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-recent-works"] });
      queryClient.invalidateQueries({ queryKey: ["admin-works"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(
        variables.is_featured
          ? "Karya ditandai sebagai Unggulan (Featured)!"
          : "Karya dihapus dari status Unggulan.",
      );
    },
  });

  const archiveWork = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("works")
        .update({ status: "archived" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recent-works"] });
      queryClient.invalidateQueries({ queryKey: ["admin-works"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Karya berhasil diarsipkan.");
    },
  });

  return (
    <div className="space-y-8">
      {/* Header with prominent + Tambah Karya Baru action button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Selamat datang di panel pengelola karya Gredupedia 2026.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          id="btn-tambah-karya-dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lift"
        >
          <Plus className="mr-0.5 h-4 w-4" />
          Tambah Karya Baru
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon={ImageIcon}
          label="Total Karya"
          value={stats?.works ?? "—"}
          sub="Semua status"
          color="bg-primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Dipublikasi"
          value={stats?.published ?? "—"}
          sub="Tampil di galeri publik"
          color="bg-highlight-foreground"
        />
        <StatCard
          icon={Star}
          label="Karya Unggulan"
          value={stats?.featured ?? "—"}
          sub="Tampil di landing page"
          color="bg-accent"
        />
        <StatCard
          icon={Users}
          label="Peserta"
          value={stats?.participants ?? "—"}
          sub="Mahasiswa terdaftar"
          color="bg-destructive"
        />
        <StatCard
          icon={Tag}
          label="Kategori"
          value={stats?.categories ?? "—"}
          sub="Kategori karya"
          color="bg-ring"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            onClick: () => setIsAddModalOpen(true),
            label: "Tambah Karya Baru",
            sub: "Input manual karya satu-satu",
            icon: Plus,
            color: "border-border hover:border-primary hover:text-primary",
          },
          {
            to: "/admin/peserta",
            label: "Kelola & Bulk Input Peserta",
            sub: "Input masal puluhan peserta",
            icon: Users,
            color: "text-accent border-border hover:border-accent",
          },
          {
            to: "/admin/kategori",
            label: "Kelola Kategori",
            sub: "Atur kategori karya",
            icon: Tag,
            color: "text-foreground border-border hover:border-foreground",
          },
        ].map((item, i) =>
          item.to ? (
            <Link
              key={i}
              to={item.to}
              className={`group flex items-center justify-between rounded-2xl border bg-card p-5 transition-smooth hover:-translate-y-0.5 hover:shadow-soft ${item.color}`}
            >
              <div>
                <p className="font-display font-bold group-hover:text-primary transition-smooth">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <item.icon className="h-5 w-5 text-muted-foreground transition-smooth group-hover:scale-110 group-hover:text-primary" />
            </Link>
          ) : (
            <button
              key={i}
              onClick={item.onClick}
              className={`group flex items-center justify-between rounded-2xl border bg-card p-5 text-left transition-smooth hover:-translate-y-0.5 hover:shadow-soft ${item.color}`}
            >
              <div>
                <p className="font-display font-bold group-hover:text-primary transition-smooth">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <item.icon className="h-5 w-5 text-muted-foreground transition-smooth group-hover:scale-110 group-hover:text-primary" />
            </button>
          ),
        )}
      </div>

      {/* Karya Table Section */}
      <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Karya Terbaru</h2>
          </div>
          <Link
            to="/admin/karya"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Kelola Semua Karya ({stats?.works ?? 0}) →
          </Link>
        </div>

        {worksLoading ? (
          <div className="p-12 text-center text-muted-foreground">Memuat daftar karya...</div>
        ) : recentWorks.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <ImageIcon className="h-7 w-7" />
            </div>
            <p className="font-display font-semibold text-lg">Belum Ada Karya Terdaftar</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Mulai tambahkan karya pertama ke pameran digital Gredupedia.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Tambah Karya Pertama
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Cover / Karya</th>
                  <th className="px-6 py-4 text-left font-semibold">Pembuat / Tim</th>
                  <th className="px-6 py-4 text-left font-semibold">Kategori</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Unggulan</th>
                  <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentWorks.map((w: any) => (
                  <tr key={w.id} className="transition-smooth hover:bg-secondary/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            w.thumbnail_url ??
                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120"
                          }
                          alt={w.title}
                          className="h-12 w-16 rounded-xl object-cover border border-border shadow-soft"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground max-w-xs">
                            {w.title}
                          </p>
                          {w.media_tools && (
                            <p className="truncate text-xs text-muted-foreground max-w-xs">
                              {w.media_tools}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {w.participant?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                        {w.category?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusColor[w.status] ?? ""
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          toggleFeatured.mutate({ id: w.id, is_featured: !w.is_featured })
                        }
                        title={w.is_featured ? "Hapus dari unggulan" : "Jadikan unggulan"}
                        className="text-muted-foreground transition-smooth hover:scale-110"
                      >
                        {w.is_featured ? (
                          <Star className="h-5 w-5 fill-accent text-accent" />
                        ) : (
                          <StarOff className="h-5 w-5 opacity-40 hover:opacity-100" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to="/admin/karya/$id/edit"
                          params={{ id: w.id }}
                          className="rounded-lg p-2 transition-smooth hover:bg-primary/10 hover:text-primary"
                          title="Edit karya"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        {w.status !== "archived" && (
                          <button
                            onClick={() => {
                              if (confirm(`Arsipkan karya "${w.title}"?`)) {
                                archiveWork.mutate(w.id);
                              }
                            }}
                            className="rounded-lg p-2 transition-smooth hover:bg-destructive/10 hover:text-destructive"
                            title="Arsipkan karya"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Pop-Up Modal */}
      <AddArtworkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
