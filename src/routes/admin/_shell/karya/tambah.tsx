import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ArtworkForm, type WorkFormValues } from "@/components/admin/ArtworkForm";

export const Route = createFileRoute("/admin/karya/tambah")(({
  head: () => ({ meta: [{ title: "Tambah Karya — Admin Gredupedia" }] }),
  component: TambahKarya,
}) as any);

function TambahKarya() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: WorkFormValues) => {
      const { error } = await supabase.from("works").insert({
        title: values.title,
        participant_id: values.participant_id,
        category_id: values.category_id,
        description: values.description ?? null,
        goals: values.goals ?? null,
        thumbnail_url: values.thumbnail_url || null,
        media_url: values.media_url || null,
        external_link: values.external_link || null,
        media_tools: values.media_tools || null,
        is_featured: values.is_featured,
        status: values.status,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-works"] });
      queryClient.invalidateQueries({ queryKey: ["published-works"] });
      queryClient.invalidateQueries({ queryKey: ["featured-works"] });
      navigate({ to: "/admin/karya" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/admin/karya"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-smooth hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold">Tambah Karya</h1>
          <p className="mt-0.5 text-muted-foreground">Tambahkan karya baru ke pameran Gredupedia</p>
        </div>
      </div>

      {mutation.isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Terjadi kesalahan: {(mutation.error as Error)?.message}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <ArtworkForm
          onSubmit={(values) => mutation.mutateAsync(values)}
          submitLabel="Simpan Karya"
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
