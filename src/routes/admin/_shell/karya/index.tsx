import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Archive, Eye, EyeOff, Star, StarOff, Search, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/karya/")(({
  head: () => ({ meta: [{ title: "Kelola Karya — Admin Gredupedia" }] }),
  component: AdminKarya,
}) as any);

const statusColor: Record<string, string> = {
  published: "bg-highlight/20 text-highlight-foreground",
  draft: "bg-secondary text-secondary-foreground",
  archived: "bg-muted text-muted-foreground",
};

function AdminKarya() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: works = [], isLoading } = useQuery({
    queryKey: ["admin-works"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("works")
        .select(`*, participant:participants(name), category:categories(name)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase
        .from("works")
        .update({ is_featured })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-works"] }),
  });

  const archiveWork = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("works")
        .update({ status: "archived" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-works"] }),
  });

  const filtered = works.filter((w: any) => {
    const matchSearch =
      !search ||
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      (w.participant?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-smooth hover:border-primary hover:text-primary hover:shadow-soft"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">Kelola Karya</h1>
            <p className="mt-0.5 text-muted-foreground text-sm">
              {works.length} karya terdaftar
            </p>
          </div>
        </div>
        <Link
          to="/admin/karya/tambah"
          id="btn-tambah-karya"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lift"
        >
          <Plus className="h-4 w-4" />
          Tambah Karya
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="karya-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau peserta..."
            className="w-64 rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"
          />
        </div>
        {["all", "published", "draft", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-smooth ${
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card hover:bg-secondary"
            }`}
          >
            {s === "all" ? "Semua" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display font-semibold">Tidak ada karya</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tambahkan karya pertama atau ubah filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Karya</th>
                  <th className="px-4 py-3 text-left font-semibold">Peserta</th>
                  <th className="px-4 py-3 text-left font-semibold">Kategori</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-center font-semibold">Unggulan</th>
                  <th className="px-4 py-3 text-left font-semibold">Dibuat</th>
                  <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((w: any) => (
                  <tr key={w.id} className="transition-smooth hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            w.thumbnail_url ??
                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100"
                          }
                          alt={w.title}
                          className="h-10 w-14 rounded-lg object-cover"
                        />
                        <span className="max-w-[200px] truncate font-medium">{w.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {w.participant?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {w.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusColor[w.status] ?? ""
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          toggleFeatured.mutate({ id: w.id, is_featured: !w.is_featured })
                        }
                        title={w.is_featured ? "Hapus dari unggulan" : "Jadikan unggulan"}
                        className="text-muted-foreground transition-smooth hover:text-accent"
                      >
                        {w.is_featured ? (
                          <Star className="h-4 w-4 fill-accent text-accent" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(w.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
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
                              if (confirm(`Arsipkan "${w.title}"?`))
                                archiveWork.mutate(w.id);
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
    </div>
  );
}
