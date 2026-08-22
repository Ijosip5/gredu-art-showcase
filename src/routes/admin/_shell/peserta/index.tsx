import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit2, Search, ImageIcon, Users, UserPlus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AddParticipantModal } from "@/components/admin/AddParticipantModal";

export const Route = createFileRoute("/admin/_shell/_shell/peserta/")(({
  head: () => ({ meta: [{ title: "Kelola Peserta — Admin Gredupedia" }] }),
  component: AdminPeserta,
}) as any);

function AdminPeserta() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState<"single" | "bulk">("single");

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ["admin-participants-full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("participants")
        .select(`*, works(id, status)`)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const openModal = (tab: "single" | "bulk") => {
    setModalDefaultTab(tab);
    setIsModalOpen(true);
  };

  const filtered = participants.filter(
    (p: any) =>
      !search || p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Kelola Peserta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {participants.length} peserta terdaftar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openModal("bulk")}
            id="btn-tambah-peserta-bulk"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 font-semibold transition-smooth hover:border-primary hover:text-primary hover:shadow-soft"
          >
            <Users className="h-4 w-4 text-primary" />
            Tambah Masal (Bulk)
          </button>
          <button
            onClick={() => openModal("single")}
            id="btn-tambah-peserta"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Plus className="h-4 w-4" />
            Tambah Peserta
          </button>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="relative w-72">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="peserta-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari peserta..."
          className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
        />
      </div>

      {/* Table / List */}
      <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="mx-auto max-w-xl p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <p className="font-display font-bold text-xl">Belum Ada Peserta</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan peserta satu persatu atau langsung masukkan puluhan nama sekaligus menggunakan fitur Tambah Masal.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => openModal("bulk")}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-smooth hover:border-primary hover:text-primary"
              >
                <Users className="h-4 w-4 text-primary" /> Tambah Masal
              </button>
              <button
                onClick={() => openModal("single")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:opacity-90"
              >
                <UserPlus className="h-4 w-4" /> Tambah Satuan
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((p: any) => {
              const totalWorks = p.works?.length ?? 0;
              const published = p.works?.filter((w: any) => w.status === "published").length ?? 0;
              return (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4 transition-smooth hover:bg-secondary/30">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
                    {p.profile_image ? (
                      <img src={p.profile_image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-display text-lg font-bold text-muted-foreground">
                        {p.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.class ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>
                      {published}/{totalWorks} karya dipublikasi
                    </span>
                  </div>
                  <Link
                    to="/admin/peserta/$id/edit"
                    params={{ id: p.id }}
                    className="rounded-lg p-2 transition-smooth hover:bg-primary/10 hover:text-primary"
                    title="Edit peserta"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pop-up Modal */}
      <AddParticipantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTab={modalDefaultTab}
      />
    </div>
  );
}
