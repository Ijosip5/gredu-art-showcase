import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/kategori/")((({
  head: () => ({ meta: [{ title: "Kelola Kategori — Admin Gredupedia" }] }),
  component: AdminKategori,
}) as any));

function AdminKategori() {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`*, works(id)`)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!newName.trim()) return;
      const { error } = await supabase.from("categories").insert({
        name: newName.trim(),
        description: newDesc.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewName("");
      setNewDesc("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from("categories")
        .update({ name: editName.trim(), description: editDesc.trim() || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const startEdit = (cat: any) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description ?? "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Kelola Kategori</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tambah, ubah, atau hapus kategori karya pameran.
        </p>
      </div>

      {/* 2-column responsive grid: list (left, wider) + add form (right) */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Categories list — spans 2 cols on lg */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-lg">
                Daftar Kategori
                {!isLoading && (
                  <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {categories.length}
                  </span>
                )}
              </h2>
            </div>

            {isLoading ? (
              <div className="p-10 text-center text-muted-foreground">Memuat...</div>
            ) : categories.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                <Tag className="mx-auto mb-3 h-8 w-8 opacity-30" />
                <p>Belum ada kategori. Tambahkan kategori pertama.</p>
              </div>
            ) : (
              /* Every item gets border-bottom, including the last one */
              <div>
                {categories.map((cat: any) => (
                  <div key={cat.id} className="border-b border-border px-5 py-4 last:border-b-0">
                    {editId === cat.id ? (
                      <div className="space-y-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"
                        />
                        <input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          placeholder="Deskripsi..."
                          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateMutation.mutate({ id: cat.id })}
                            disabled={updateMutation.isPending}
                            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold"
                          >
                            <X className="h-3.5 w-3.5" />
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Tag className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{cat.name}</p>
                          {cat.description && (
                            <p className="text-xs text-muted-foreground">{cat.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <span className="font-medium">{cat.works?.length ?? 0}</span> karya
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={() => startEdit(cat)}
                            className="rounded-lg p-2 transition-smooth hover:bg-primary/10 hover:text-primary"
                            title="Edit kategori"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus kategori "${cat.name}"?`)) {
                                deleteMutation.mutate(cat.id);
                              }
                            }}
                            disabled={(cat.works?.length ?? 0) > 0}
                            title={
                              (cat.works?.length ?? 0) > 0
                                ? "Tidak bisa hapus: masih ada karya dalam kategori ini"
                                : "Hapus kategori"
                            }
                            className="rounded-lg p-2 transition-smooth hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add new category form — 1 col, sticky on lg */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:sticky lg:top-8">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold">Tambah Kategori</h2>
            </div>
            <div className="space-y-3">
              <input
                id="new-category-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nama kategori..."
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
              />
              <input
                id="new-category-desc"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Deskripsi singkat (opsional)..."
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
              />
              <button
                id="btn-tambah-kategori"
                onClick={() => createMutation.mutate()}
                disabled={!newName.trim() || createMutation.isPending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                {createMutation.isPending ? "Menyimpan..." : "Tambah Kategori"}
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">💡 Catatan:</p>
              <p>Kategori yang sudah memiliki karya tidak dapat dihapus.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
