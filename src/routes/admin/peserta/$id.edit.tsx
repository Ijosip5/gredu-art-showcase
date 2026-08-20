import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ParticipantForm, type ParticipantFormValues } from "@/components/admin/ParticipantForm";

export const Route = createFileRoute("/admin/peserta/$id/edit")(({
  head: () => ({ meta: [{ title: "Edit Peserta — Admin Gredupedia" }] }),
  component: EditPeserta,
}) as any);

function EditPeserta() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: participant, isLoading } = useQuery({
    queryKey: ["admin-participant", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("participants")
        .select(`*, works(id, title, status, thumbnail_url)`)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: ParticipantFormValues) => {
      const { error } = await supabase
        .from("participants")
        .update({
          name: values.name,
          class: values.class || null,
          profile_image: values.profile_image || null,
          bio: values.bio || null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-participants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-participants-full"] });
      queryClient.invalidateQueries({ queryKey: ["admin-participant", id] });
      navigate({ to: "/admin/peserta" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("participants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-participants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-participants-full"] });
      navigate({ to: "/admin/peserta" });
    },
  });

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">Memuat data peserta...</div>;
  }

  if (!participant) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-lg font-semibold">Peserta tidak ditemukan</p>
        <Link to="/admin/peserta" className="mt-3 inline-block text-sm text-primary hover:underline">
          Kembali ke daftar peserta
        </Link>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    published: "bg-highlight/20 text-highlight-foreground",
    draft: "bg-secondary text-secondary-foreground",
    archived: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/peserta"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-smooth hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">Edit Peserta</h1>
            <p className="mt-0.5 text-muted-foreground">{participant.name}</p>
          </div>
        </div>
        <button
          id="btn-delete-participant"
          onClick={() => {
            if (confirm(`Hapus peserta "${participant.name}"? Semua karya akan kehilangan referensi peserta.`)) {
              deleteMutation.mutate();
            }
          }}
          disabled={deleteMutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition-smooth hover:bg-destructive hover:text-destructive-foreground disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" />
          Hapus Peserta
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          {updateMutation.isError && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Terjadi kesalahan: {(updateMutation.error as Error)?.message}
            </div>
          )}
          <ParticipantForm
            defaultValues={{
              name: participant.name,
              class: participant.class ?? "",
              profile_image: participant.profile_image ?? "",
              bio: participant.bio ?? "",
            }}
            onSubmit={(values) => updateMutation.mutateAsync(values)}
            submitLabel="Perbarui Peserta"
            isSubmitting={updateMutation.isPending}
          />
        </div>

        {/* Works by this participant */}
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              Karya Peserta ({participant.works?.length ?? 0})
            </h2>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {participant.works?.length === 0 ? (
              <p className="px-5 py-6 text-sm text-muted-foreground">Belum ada karya.</p>
            ) : (
              participant.works?.map((w: any) => (
                <div key={w.id} className="flex items-center gap-3 px-5 py-3">
                  <img
                    src={
                      w.thumbnail_url ??
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100"
                    }
                    alt={w.title}
                    className="h-8 w-12 rounded object-cover"
                  />
                  <span className="flex-1 truncate text-sm">{w.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[w.status] ?? ""}`}>
                    {w.status}
                  </span>
                  <Link
                    to="/admin/karya/$id/edit"
                    params={{ id: w.id }}
                    className="text-xs text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
