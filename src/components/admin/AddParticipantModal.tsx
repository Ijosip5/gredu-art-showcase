import { useState } from "react";
import { X, UserPlus, Users, Sparkles, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ParticipantForm, type ParticipantFormValues } from "./ParticipantForm";

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "single" | "bulk";
}

export function AddParticipantModal({
  isOpen,
  onClose,
  defaultTab = "single",
}: AddParticipantModalProps) {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">(defaultTab);
  const [bulkNames, setBulkNames] = useState("");
  const [bulkClass, setBulkClass] = useState("");
  const queryClient = useQueryClient();

  // Single insert mutation
  const singleMutation = useMutation({
    mutationFn: async (values: ParticipantFormValues) => {
      const { error } = await supabase.from("participants").insert({
        name: values.name,
        class: values.class || null,
        profile_image: values.profile_image || null,
        bio: values.bio || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-participants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-participants-full"] });
      onClose();
    },
  });

  // Bulk insert mutation
  const bulkMutation = useMutation({
    mutationFn: async () => {
      const nameList = bulkNames
        .split("\n")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      if (nameList.length === 0) {
        throw new Error("Masukkan minimal 1 nama peserta.");
      }

      const rows = nameList.map((name) => ({
        name,
        class: bulkClass.trim() || null,
      }));

      const { error } = await supabase.from("participants").insert(rows);
      if (error) throw error;
      return nameList.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-participants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-participants-full"] });
      setBulkNames("");
      setBulkClass("");
      onClose();
    },
  });

  if (!isOpen) return null;

  const parsedNameCount = bulkNames
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n.length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card shadow-lift transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {activeTab === "single" ? (
                <UserPlus className="h-5 w-5" />
              ) : (
                <Users className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Tambah Peserta</h2>
              <p className="text-xs text-muted-foreground">
                Pilih metode penambahan peserta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border bg-secondary/40 px-6 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab("single")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-smooth ${
              activeTab === "single"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Tambah Satuan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-smooth ${
              activeTab === "bulk"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            Tambah Masal (Bulk)
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
              Cepat
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === "single" ? (
            <div>
              {singleMutation.isError && (
                <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Terjadi kesalahan: {(singleMutation.error as Error)?.message}
                </div>
              )}
              <ParticipantForm
                onSubmit={(values) => singleMutation.mutateAsync(values)}
                submitLabel="Simpan Peserta"
                isSubmitting={singleMutation.isPending}
              />
            </div>
          ) : (
            <div className="space-y-5">
              {bulkMutation.isError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {(bulkMutation.error as Error)?.message}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Kelas / Angkatan Bersama (Opsional)
                </label>
                <input
                  value={bulkClass}
                  onChange={(e) => setBulkClass(e.target.value)}
                  placeholder="Contoh: TP 2022A, Angkatan 2023"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Semua peserta yang di-input masal akan menggunakan kelas ini.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium">
                    Daftar Nama Peserta <span className="text-destructive">*</span>
                  </label>
                  {parsedNameCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-highlight/20 px-3 py-1 text-xs font-semibold text-highlight-foreground">
                      <Sparkles className="h-3 w-3" /> {parsedNameCount} nama terdeteksi
                    </span>
                  )}
                </div>
                <textarea
                  rows={8}
                  value={bulkNames}
                  onChange={(e) => setBulkNames(e.target.value)}
                  placeholder={`Ketik atau tempel nama peserta (1 nama per baris):\n\nRian Kurniawan\nSiti Rahmawati\nBudi Santoso\nAlya Nur Fadhilah`}
                  className="w-full font-sans rounded-xl border border-input bg-background p-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15 resize-y"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Pisahkan setiap nama peserta dengan baris baru (Enter). Anda dapat menambahkan foto profil &amp; bio nanti.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-smooth hover:bg-secondary"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => bulkMutation.mutate()}
                  disabled={parsedNameCount === 0 || bulkMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Check className="h-4 w-4" />
                  {bulkMutation.isPending
                    ? "Menyimpan..."
                    : `Simpan ${parsedNameCount > 0 ? parsedNameCount : ""} Peserta`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
