// ─── karya.ts ─────────────────────────────────────────────────────────────────
// Legacy type kept for backward compatibility during migration.
// New code should import from @/types/database instead.

export type Karya = {
  id: string;
  title: string;
  creator: string;
  category: string;
  media: string;
  image: string;
  description: string;
  goals: string;
  featured: boolean;
  externalLink: string;
};

export const CATEGORIES = [
  "Semua",
  "Media Pembelajaran",
  "Video & Animasi",
  "Desain Grafis",
  "Game Edukasi",
] as const;

// ─── Supabase Query Helpers ──────────────────────────────────────────────────
// These are the live data functions used by public pages.

import { supabase } from "@/lib/supabase";
import type { WorkWithRelations } from "@/types/database";

/** Fetch all published works with participant + category joined */
export async function fetchPublishedWorks(): Promise<WorkWithRelations[]> {
  const { data, error } = await supabase
    .from("works")
    .select(
      `
      *,
      participant:participants ( id, name ),
      category:categories ( id, name )
    `,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as WorkWithRelations[];
}

/** Fetch featured published works for the home page */
export async function fetchFeaturedWorks(limit = 4): Promise<WorkWithRelations[]> {
  const { data, error } = await supabase
    .from("works")
    .select(
      `
      *,
      participant:participants ( id, name ),
      category:categories ( id, name )
    `,
    )
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as WorkWithRelations[];
}

/** Fetch a single work by ID (public — only published) */
export async function fetchWorkById(id: string): Promise<WorkWithRelations | null> {
  const { data, error } = await supabase
    .from("works")
    .select(
      `
      *,
      participant:participants ( id, name ),
      category:categories ( id, name )
    `,
    )
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data as WorkWithRelations | null;
}

/** Fetch related works in the same category */
export async function fetchRelatedWorks(
  categoryId: string,
  excludeId: string,
  limit = 3,
): Promise<WorkWithRelations[]> {
  const { data, error } = await supabase
    .from("works")
    .select(
      `
      *,
      participant:participants ( id, name ),
      category:categories ( id, name )
    `,
    )
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as WorkWithRelations[];
}
