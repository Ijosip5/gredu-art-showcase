import { createFileRoute, useNavigate, Link, notFound } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ArtworkForm, type WorkFormValues } from "@/components/admin/ArtworkForm";

export const Route = createFileRoute("/admin/_shell/karya/$id/edit")(({
  head: () => ({ meta: [{ title: "Edit Karya — Admin Gredupedia" }] }),
  component: EditKarya,
}) as any);

function EditKarya() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: work, isLoading } = useQuery({
    queryKey: ["admin-work", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("works")
        .select(`*, participant:participants(id, name), category:categories(id, name)`)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: WorkFormValues) => {
      const { error } = await supabase
        .from("works")
        .update({
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
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-works"] });
      queryClient.invalidateQueries({ queryKey: ["admin-work", id] });
      queryClient.invalidateQueries({ queryKey: ["published-works"] });
      queryClient.invalidateQueries({ queryKey: ["featured-works"] });
      navigate({ to: "/admin/karya" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("works").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-works"] });
      queryClient.invalidateQueries({ queryKey: ["published-works"] });
      queryClient.invalidateQueries({ queryKey: ["featured-works"] });
      navigate({ to: "/admin/karya" });
    },
  });

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">Memuat data karya...</div>;
  }

  if (!work) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-lg font-semibold">Karya tidak ditemukan</p>
        <Link to="/admin/karya" className="mt-3 inline-block text-sm text-primary hover:underline">
          Kembali ke daftar karya
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/karya"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-smooth hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">Edit Karya</h1>
            <p className="mt-0.5 text-muted-foreground truncate max-w-sm">{work.title}</p>
          </div>
        </div>
        <button
          id="btn-delete-work"
          onClick={() => {
            if (confirm(`Hapus permanen karya "${work.title}"? Tindakan ini tidak dapat dibatalkan.`)) {
              deleteMutation.mutate();
            }
          }}
          disabled={deleteMutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition-smooth hover:bg-destructive hover:text-destructive-foreground disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" />
          Hapus Permanen
        </button>
      </div>

      {updateMutation.isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Terjadi kesalahan: {(updateMutation.error as Error)?.message}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <ArtworkForm
          defaultValues={work}
          onSubmit={(values) => updateMutation.mutateAsync(values)}
          submitLabel="Perbarui Karya"
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </div>
  );
}
