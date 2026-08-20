-- ─── Gredupedia CMS — Initial Database Schema ───────────────────────────────
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── Categories ────────────────────────────────────────────────────────────────
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);

comment on table public.categories is 'Artwork categories (e.g. Media Pembelajaran, Game Edukasi)';

-- ── Participants ──────────────────────────────────────────────────────────────
create table public.participants (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  class         text,
  profile_image text,
  bio           text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.participants is 'Students / creators who submit artworks';

-- ── Works (Artworks) ──────────────────────────────────────────────────────────
create table public.works (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  participant_id uuid references public.participants(id) on delete set null,
  category_id    uuid references public.categories(id) on delete set null,
  description    text,
  goals          text,
  thumbnail_url  text,
  media_url      text,
  external_link  text,
  media_tools    text,
  is_featured    boolean not null default false,
  status         text not null default 'draft'
                   check (status in ('draft', 'published', 'archived')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.works is 'Student artworks submitted to Gredupedia showcase';
comment on column public.works.status is 'draft | published | archived';
comment on column public.works.is_featured is 'Featured works appear on the home page';

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index works_status_idx        on public.works (status);
create index works_is_featured_idx   on public.works (is_featured) where status = 'published';
create index works_participant_idx   on public.works (participant_id);
create index works_category_idx      on public.works (category_id);

-- ── Auto-update updated_at ────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger works_updated_at
  before update on public.works
  for each row execute function public.set_updated_at();

create trigger participants_updated_at
  before update on public.participants
  for each row execute function public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.categories   enable row level security;
alter table public.participants enable row level security;
alter table public.works        enable row level security;

-- Public: anyone can read categories
create policy "categories_public_read"
  on public.categories for select
  using (true);

-- Public: anyone can read participants
create policy "participants_public_read"
  on public.participants for select
  using (true);

-- Public: only published works are visible
create policy "works_public_read"
  on public.works for select
  using (status = 'published');

-- Authenticated (admin): full access to all tables
create policy "categories_admin_all"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

create policy "participants_admin_all"
  on public.participants for all
  to authenticated
  using (true)
  with check (true);

create policy "works_admin_all"
  on public.works for all
  to authenticated
  using (true)
  with check (true);

-- ── Seed: Default Categories ──────────────────────────────────────────────────
insert into public.categories (name, description) values
  ('Media Pembelajaran', 'Produk media interaktif, LMS, simulator, dan sejenisnya'),
  ('Video & Animasi',    'Motion graphic, dokumenter, animasi 2D/3D'),
  ('Desain Grafis',      'Infografis, poster, identitas visual'),
  ('Game Edukasi',       'Game berbasis pembelajaran interaktif');

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE: Run these in Supabase Storage settings or via dashboard:
--   1. Create bucket named "thumbnails" → set to Public
--   2. Allow authenticated users to upload (INSERT policy on storage.objects)
-- ─────────────────────────────────────────────────────────────────────────────
