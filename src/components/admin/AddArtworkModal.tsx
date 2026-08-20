import { useState } from "react";
import { X, Plus, Upload, Sparkles, Image as ImageIcon, Check, Loader2 } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ImageUpload } from "./ImageUpload";

interface AddArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_CHOICES = [
  "Media Pembelajaran",
  "Video & Animasi",
  "Desain Grafis",
  "Game Edukasi",
];

export function AddArtworkModal({ isOpen, onClose }: AddArtworkModalProps) {
  const [title, setTitle] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [selectedParticipantId, setSelectedParticipantId] = useState("");
  const [categoryName, setCategoryName] = useState("Media Pembelajaran");
  const [mediaTools, setMediaTools] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<"published" | "draft">("published");

  const queryClient = useQueryClient();

  // Fetch participants for autocomplete/select
  const { data: participants = [] } = useQuery({
    queryKey: ["admin-participants"],
    queryFn: async () => {
      const { data } = await supabase
        .from("participants")
        .select("id, name")
        .order("name");
      return data ?? [];
    },
    enabled: isOpen,
  });

  // Fetch categories to map name to category_id
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      return data ?? [];
    },
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) {
        throw new Error("Judul Karya wajib diisi.");
      }

      const finalCreator = creatorName.trim();
      if (!finalCreator && !selectedParticipantId) {
        throw new Error("Nama Pembuat / Tim wajib diisi.");
      }

      if (!thumbnailUrl.trim()) {
        throw new Error("Unggah Cover Karya / Thumbnail wajib diisi.");
      }

      // Find or create participant
      let participantId = selectedParticipantId;
      if (!participantId && finalCreator) {
        // Check if participant exists
        const existing = participants.find(
          (p: any) => p.name.toLowerCase() === finalCreator.toLowerCase(),
        );

        if (existing) {
          participantId = existing.id;
        } else {
          // Create new participant
          const { data: newP, error: pErr } = await supabase
            .from("participants")
            .insert({ name: finalCreator })
            .select("id")
            .single();

          if (pErr) throw pErr;
          participantId = newP.id;
        }
      }

      // Find category_id
      let categoryId: string | null = null;
      const matchedCat = categories.find((c: any) => c.name === categoryName);
      if (matchedCat) {
        categoryId = matchedCat.id;
      } else if (categories && categories.length > 0) {
        categoryId = (categories[0] as any).id;
      }

      // Insert work into Supabase
      const { error } = await supabase.from("works").insert({
        title: title.trim(),
        participant_id: participantId || null,
        category_id: categoryId,
        description: description.trim() || null,
        goals: null,
        thumbnail_url: thumbnailUrl.trim(),
        media_url: null,
        external_link: externalLink.trim() || null,
        media_tools: mediaTools.trim() || null,
        is_featured: isFeatured,
        status: status,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-works"] });
      queryClient.invalidateQueries({ queryKey: ["admin-recent-works"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["published-works"] });
      queryClient.invalidateQueries({ queryKey: ["featured-works"] });
      queryClient.invalidateQueries({ queryKey: ["admin-participants"] });

      toast.success("Karya berhasil ditambahkan secara manual!");
      resetForm();
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menambahkan karya.");
    },
  });

  const resetForm = () => {
    setTitle("");
    setCreatorName("");
    setSelectedParticipantId("");
    setCategoryName("Media Pembelajaran");
    setMediaTools("");
    setDescription("");
    setExternalLink("");
    setThumbnailUrl("");
    setIsFeatured(false);
    setStatus("published");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card shadow-lift transition-all my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero text-primary-foreground shadow-soft">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Tambah Karya Baru</h2>
              <p className="text-xs text-muted-foreground">
                Isi formulir untuk menambahkan karya satu persatu secara manual
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

        {/* Form Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="p-6 space-y-6 max-h-[75vh] overflow-y-auto"
        >
          {/* 1. Judul Karya */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Judul Karya <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: EcoQuest: Game Edukasi Lingkungan"
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
            />
          </div>

          {/* 2. Nama Pembuat / Tim */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Pilih Peserta Terdaftar
              </label>
              <select
                value={selectedParticipantId}
                onChange={(e) => {
                  setSelectedParticipantId(e.target.value);
                  const selected = participants.find((p: any) => p.id === e.target.value);
                  if (selected) setCreatorName(selected.name);
                }}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
              >
                <option value="">— Buat/Tulis nama baru —</option>
                {participants.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Nama Pembuat / Tim <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => {
                  setCreatorName(e.target.value);
                  setSelectedParticipantId("");
                }}
                placeholder="Contoh: Rian Kurniawan & Tim"
                required
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
              />
            </div>
          </div>

          {/* 3. Kategori & 4. Media/Alat */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Kategori <span className="text-destructive">*</span>
              </label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
              >
                {CATEGORY_CHOICES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Alat / Media yang Digunakan
              </label>
              <input
                type="text"
                value={mediaTools}
                onChange={(e) => setMediaTools(e.target.value)}
                placeholder="Contoh: Unity, C#, Figma, Blender"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
              />
            </div>
          </div>

          {/* 5. Deskripsi Konsep Karya */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Deskripsi Konsep Karya
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan konsep, ide dasar, serta latar belakang pembuatan karya..."
              className="w-full font-sans rounded-xl border border-input bg-background p-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15 resize-y"
            />
          </div>

          {/* 6. Tautan Luar Karya */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Tautan Luar Karya (Opsional)
            </label>
            <input
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://example.com/demo-karya"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
            />
          </div>

          {/* 7. Unggah Cover Karya */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Unggah Cover Karya / Thumbnail <span className="text-destructive">*</span>
            </label>
            <ImageUpload
              value={thumbnailUrl}
              onChange={(url) => setThumbnailUrl(url)}
            />
          </div>

          {/* 8. Toggles: Featured & Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-smooth hover:border-primary">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-5 w-5 rounded border-input accent-primary"
              />
              <div>
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-accent" /> Karya Unggulan (Featured)
                </p>
                <p className="text-xs text-muted-foreground">Tampilkan di Halaman Utama</p>
              </div>
            </label>

            <div className="flex items-center justify-around rounded-2xl border border-border bg-card p-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="modal-status"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                  className="accent-primary"
                />
                <span className="rounded-full bg-highlight/20 px-3 py-1 text-xs font-semibold text-highlight-foreground">
                  Published
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="modal-status"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="accent-primary"
                />
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  Draft
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-smooth hover:bg-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan Karya...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Simpan Karya Baru
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
