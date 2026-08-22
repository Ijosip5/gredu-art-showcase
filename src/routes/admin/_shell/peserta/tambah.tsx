import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ParticipantForm, type ParticipantFormValues } from "@/components/admin/ParticipantForm";

export const Route = createFileRoute("/admin/_shell/_shell/peserta/tambah")(({
  head: () => ({ meta: [{ title: "Tambah Peserta — Admin Gredupedia" }] }),
  component: TambahPeserta,
}) as any);

function TambahPeserta() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
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
      navigate({ to: "/admin/peserta" });
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/peserta"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-smooth hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">Tambah Peserta</h1>
            <p className="mt-0.5 text-muted-foreground">Daftarkan peserta baru ke Gredupedia</p>
          </div>
        </div>
      </div>

      {mutation.isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Terjadi kesalahan: {(mutation.error as Error)?.message}
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <ParticipantForm
          onSubmit={(values) => mutation.mutateAsync(values)}
          submitLabel="Simpan Peserta"
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
