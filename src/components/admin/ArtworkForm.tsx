import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ImageUpload } from "./ImageUpload";
import type { WorkWithRelations, WorkStatus } from "@/types/database";

const workSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  participant_id: z.string().min(1, "Pilih peserta"),
  category_id: z.string().min(1, "Pilih kategori"),
  description: z.string().optional(),
  goals: z.string().optional(),
  thumbnail_url: z.string().optional(),
  media_url: z.string().optional(),
  external_link: z.string().optional(),
  media_tools: z.string().optional(),
  is_featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
});

export type WorkFormValues = z.infer<typeof workSchema>;

interface ArtworkFormProps {
  defaultValues?: Partial<WorkWithRelations>;
  onSubmit: (values: WorkFormValues) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function ArtworkForm({
  defaultValues,
  onSubmit,
  submitLabel = "Simpan Karya",
  isSubmitting,
}: ArtworkFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      participant_id: defaultValues?.participant_id ?? "",
      category_id: defaultValues?.category_id ?? "",
      description: defaultValues?.description ?? "",
      goals: defaultValues?.goals ?? "",
      thumbnail_url: defaultValues?.thumbnail_url ?? "",
      media_url: defaultValues?.media_url ?? "",
      external_link: defaultValues?.external_link ?? "",
      media_tools: defaultValues?.media_tools ?? "",
      is_featured: defaultValues?.is_featured ?? false,
      status: (defaultValues?.status as WorkStatus) ?? "draft",
    },
  });

  const thumbnailUrl = watch("thumbnail_url");
  const status = watch("status");

  const { data: participants = [] } = useQuery({
    queryKey: ["admin-participants"],
    queryFn: async () => {
      const { data } = await supabase
        .from("participants")
        .select("id, name")
        .order("name");
      return data ?? [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      return data ?? [];
    },
  });

  const statusOptions: { value: WorkStatus; label: string; color: string }[] = [
    { value: "draft", label: "Draft", color: "bg-secondary text-secondary-foreground" },
    { value: "published", label: "Published", color: "bg-highlight/20 text-highlight-foreground" },
    { value: "archived", label: "Archived", color: "bg-muted text-muted-foreground" },
  ];

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left: main fields */}
        <div className="space-y-6">
          <Field label="Judul Karya" error={errors.title?.message} required>
            <input
              {...register("title")}
              id="work-title"
              placeholder="Masukkan judul karya..."
              className={inputCls(!!errors.title)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Peserta" error={errors.participant_id?.message} required>
              <select {...register("participant_id")} id="work-participant" className={inputCls(!!errors.participant_id)}>
                <option value="">— Pilih peserta —</option>
                {participants.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Kategori" error={errors.category_id?.message} required>
              <select {...register("category_id")} id="work-category" className={inputCls(!!errors.category_id)}>
                <option value="">— Pilih kategori —</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Deskripsi">
            <textarea
              {...register("description")}
              id="work-description"
              rows={4}
              placeholder="Deskripsikan karya secara singkat..."
              className={inputCls(false) + " resize-y"}
            />
          </Field>

          <Field label="Tujuan & Konteks">
            <textarea
              {...register("goals")}
              id="work-goals"
              rows={3}
              placeholder="Tujuan pembelajaran atau konteks karya..."
              className={inputCls(false) + " resize-y"}
            />
          </Field>

          <Field label="Media / Alat">
            <input
              {...register("media_tools")}
              id="work-media-tools"
              placeholder="Contoh: Unity, C#, Figma (pisahkan dengan koma)"
              className={inputCls(false)}
            />
          </Field>

          <Field label="Link Karya / Demo">
            <input
              {...register("external_link")}
              id="work-external-link"
              type="url"
              placeholder="https://..."
              className={inputCls(false)}
            />
          </Field>

          <Field label="Media URL (opsional)">
            <input
              {...register("media_url")}
              id="work-media-url"
              type="url"
              placeholder="Link video YouTube, embed, dll."
              className={inputCls(false)}
            />
          </Field>
        </div>

        {/* Right: thumbnail + status */}
        <div className="space-y-6">
          <Field label="Thumbnail">
            <ImageUpload
              value={thumbnailUrl ?? ""}
              onChange={(url) => setValue("thumbnail_url", url)}
            />
          </Field>

          <Field label="Status Publikasi">
            <div className="flex flex-col gap-2">
              {statusOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-smooth ${
                    status === opt.value
                      ? "border-primary bg-card shadow-soft"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("status")}
                    value={opt.value}
                    className="accent-primary"
                  />
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${opt.color}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4 transition-smooth hover:border-primary">
              <input
                type="checkbox"
                {...register("is_featured")}
                id="work-featured"
                className="h-4 w-4 accent-primary"
              />
              <div>
                <p className="text-sm font-medium">Karya Unggulan</p>
                <p className="text-xs text-muted-foreground">Tampil di halaman utama</p>
              </div>
            </label>
          </Field>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <button
          id="work-submit-btn"
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string | undefined;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

const inputCls = (hasError: boolean) =>
  `w-full rounded-xl border ${hasError ? "border-destructive" : "border-input"} bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15`;
