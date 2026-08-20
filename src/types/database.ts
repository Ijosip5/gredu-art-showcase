// ─── Database Types ───────────────────────────────────────────────────────────
// Matches the Supabase PostgreSQL schema exactly.
// Keep in sync with supabase/migrations/001_initial_schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ── Row types (what comes back from the DB) ──────────────────────────────────

export interface CategoryRow {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ParticipantRow {
  id: string;
  name: string;
  class: string | null;
  profile_image: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export type WorkStatus = "draft" | "published" | "archived";

export interface WorkRow {
  id: string;
  title: string;
  participant_id: string | null;
  category_id: string | null;
  description: string | null;
  goals: string | null;
  thumbnail_url: string | null;
  media_url: string | null;
  external_link: string | null;
  media_tools: string | null;
  is_featured: boolean;
  status: WorkStatus;
  created_at: string;
  updated_at: string;
}

// ── Enriched / joined types (for display) ────────────────────────────────────

export interface WorkWithRelations extends WorkRow {
  participant: Pick<ParticipantRow, "id" | "name"> | null;
  category: Pick<CategoryRow, "id" | "name"> | null;
}

// ── Insert / update types ─────────────────────────────────────────────────────

export type WorkInsert = {
  id?: string;
  title: string;
  participant_id?: string | null;
  category_id?: string | null;
  description?: string | null;
  goals?: string | null;
  thumbnail_url?: string | null;
  media_url?: string | null;
  external_link?: string | null;
  media_tools?: string | null;
  is_featured?: boolean;
  status?: WorkStatus;
  created_at?: string;
  updated_at?: string;
};

export type WorkUpdate = Partial<WorkInsert>;

export type ParticipantInsert = {
  id?: string;
  name: string;
  class?: string | null;
  profile_image?: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ParticipantUpdate = Partial<ParticipantInsert>;

export type CategoryInsert = {
  id?: string;
  name: string;
  description?: string | null;
  created_at?: string;
};

export type CategoryUpdate = Partial<CategoryInsert>;

// ── Supabase Database generic type (for typed client) ─────────────────────────

export type Database = {
  public: {
    Tables: {
      works: {
        Row: WorkRow;
        Insert: WorkInsert;
        Update: WorkUpdate;
        Relationships: [
          {
            foreignKeyName: "works_participant_id_fkey";
            columns: ["participant_id"];
            isOneToOne: false;
            referencedRelation: "participants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "works_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      participants: {
        Row: ParticipantRow;
        Insert: ParticipantInsert;
        Update: ParticipantUpdate;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
