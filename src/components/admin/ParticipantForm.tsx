import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageUpload } from "./ImageUpload";

const participantSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  class: z.string().optional(),
  profile_image: z.string().optional(),
  bio: z.string().optional(),
});

export type ParticipantFormValues = z.infer<typeof participantSchema>;

interface ParticipantFormProps {
  defaultValues?: Partial<ParticipantFormValues>;
  onSubmit: (values: ParticipantFormValues) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function ParticipantForm({
  defaultValues,
  onSubmit,
  submitLabel = "Simpan Peserta",
  isSubmitting,
}: ParticipantFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      class: defaultValues?.class ?? "",
      profile_image: defaultValues?.profile_image ?? "",
      bio: defaultValues?.bio ?? "",
    },
  });

  const profileImage = watch("profile_image");

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6">
      <Field label="Nama Lengkap" error={errors.name?.message} required>
        <input
          {...register("name")}
          id="participant-name"
          placeholder="Nama peserta..."
          className={inputCls(!!errors.name)}
        />
      </Field>

      <Field label="Kelas / Angkatan">
        <input
          {...register("class")}
          id="participant-class"
          placeholder="Contoh: 2022A, Angkatan 2021"
          className={inputCls(false)}
        />
      </Field>

      <Field label="Foto Profil">
        <ImageUpload
          value={profileImage ?? ""}
          onChange={(url) => setValue("profile_image", url)}
        />
      </Field>

      <Field label="Bio Singkat">
        <textarea
          {...register("bio")}
          id="participant-bio"
          rows={3}
          placeholder="Ceritakan sedikit tentang peserta..."
          className={inputCls(false) + " resize-y"}
        />
      </Field>

      <div className="border-t border-border pt-6">
        <button
          id="participant-submit-btn"
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
