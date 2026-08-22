-- Roles
create type public.app_role as enum ('admin', 'editor');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "admins manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Timestamp trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "public read categories" on public.categories for select to anon, authenticated using (true);
create policy "admins write categories" on public.categories for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Participants
create table public.participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cohort text,
  profile_image text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.participants to anon;
grant select, insert, update, delete on public.participants to authenticated;
grant all on public.participants to service_role;
alter table public.participants enable row level security;
create policy "public read participants" on public.participants for select to anon, authenticated using (true);
create policy "admins write participants" on public.participants for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger participants_updated_at before update on public.participants
  for each row execute function public.set_updated_at();

-- Works
create type public.work_status as enum ('draft','published','archived');

create table public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  participant_id uuid not null references public.participants(id) on delete restrict,
  category_id uuid not null references public.categories(id) on delete restrict,
  description text not null default '',
  goals text,
  tools text,
  thumbnail_url text,
  media_url text,
  is_featured boolean not null default false,
  status public.work_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.works to anon;
grant select, insert, update, delete on public.works to authenticated;
grant all on public.works to service_role;
alter table public.works enable row level security;
create policy "public read published works" on public.works for select to anon using (status = 'published');
create policy "admins read all works" on public.works for select to authenticated
  using (status = 'published' or public.has_role(auth.uid(),'admin'));
create policy "admins write works" on public.works for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger works_updated_at before update on public.works
  for each row execute function public.set_updated_at();

create index works_status_created_idx on public.works (status, created_at desc);
create index works_category_idx on public.works (category_id);
create index works_participant_idx on public.works (participant_id);
create index works_featured_idx on public.works (is_featured) where is_featured;

-- Seed
insert into public.categories (name, slug, description) values
  ('Media Pembelajaran','media-pembelajaran','Media dan perangkat ajar digital'),
  ('Video & Animasi','video-animasi','Karya video, motion graphic, dan animasi'),
  ('Desain Grafis','desain-grafis','Poster, infografis, dan identitas visual'),
  ('Game Edukasi','game-edukasi','Permainan digital bermuatan edukatif');

insert into public.participants (name, cohort) values
  ('Rian Kurniawan & Tim','TP 2023'),
  ('Siti Rahmawati','TP 2023'),
  ('Budi Santoso','TP 2024'),
  ('Alya Nur Fadhilah & Tim','TP 2023'),
  ('Fajar Ramadhan','TP 2022'),
  ('Dewi Larasati & Tim','TP 2024'),
  ('Ilham Prasetya','TP 2022'),
  ('Nadia Puspita','TP 2024'),
  ('Tim Laboratorium TP UNY','Laboratorium');

insert into public.works (title, slug, participant_id, category_id, description, goals, tools, thumbnail_url, media_url, is_featured, status)
select w.title, w.slug, p.id, c.id, w.description, w.goals, w.tools, w.thumb, w.media, w.featured, 'published'::public.work_status
from (values
  ('EcoQuest: Game Edukasi Lingkungan Interaktif','ecoquest','Rian Kurniawan & Tim','Game Edukasi','Sebuah game petualangan 2D RPG yang dirancang untuk mengajarkan anak-anak sekolah dasar tentang pentingnya memilah sampah dan menjaga ekosistem sungai secara interaktif.','Meningkatkan literasi lingkungan siswa kelas 4-6 SD melalui pendekatan game-based learning.','Unity, C#, Aseprite','https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200','https://example.com/ecoquest-demo',true),
  ('EduVR: Pengenalan Tata Surya berbasis Virtual Reality','eduvr-tata-surya','Siti Rahmawati','Media Pembelajaran','Media pembelajaran imersif yang membawa siswa menjelajahi planet-planet di tata surya menggunakan teknologi VR Cardboard.','Menghadirkan pengalaman belajar astronomi yang konkret bagi siswa SMP dengan biaya perangkat rendah.','Blender, WebXR, Three.js','https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200','https://example.com/eduvr-web',true),
  ('Infografis Interaktif Sejarah Candi Prambanan','infografis-prambanan','Budi Santoso','Desain Grafis','Desain infografis modern berseri yang menceritakan relief candi Prambanan secara visual dengan pendekatan micro-learning.','Mengemas materi sejarah lokal menjadi konten visual yang layak dibagikan di media sosial pelajar.','Figma, Adobe Illustrator','https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200','https://example.com/prambanan-design',false),
  ('Motion Graphic: Siklus Air untuk Kelas Inklusi','motion-siklus-air','Alya Nur Fadhilah & Tim','Video & Animasi','Video animasi 2D berdurasi 4 menit yang menjelaskan siklus air dengan narasi lambat, subtitle besar, dan bahasa isyarat pendamping.','Menyediakan media ajar IPA yang aksesibel dan inklusif untuk kelas heterogen di sekolah dasar.','After Effects, Illustrator','https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200','https://example.com/siklus-air',true),
  ('Kelasku: LMS Ringan untuk Sekolah Daerah 3T','kelasku-lms','Fajar Ramadhan','Media Pembelajaran','Learning Management System super ringan yang tetap berjalan pada koneksi 2G dengan mode offline-first.','Menjembatani kesenjangan akses pembelajaran daring pada sekolah di daerah 3T.','React, Tailwind, Supabase','https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200','https://example.com/kelasku',true),
  ('AksaraKu: Game Literasi Aksara Jawa','aksaraku','Dewi Larasati & Tim','Game Edukasi','Game puzzle menulis aksara Jawa dengan sistem stroke recognition sederhana dan papan peringkat kelas.','Melestarikan literasi aksara Jawa lewat mekanik permainan yang kompetitif namun reflektif.','Godot, GDScript','https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200','https://example.com/aksaraku',false),
  ('Dokumenter Pendek: Guru di Lereng Merapi','dokumenter-merapi','Ilham Prasetya','Video & Animasi','Film dokumenter 8 menit yang merekam praktik pembelajaran adaptif para guru di kawasan rawan bencana.','Menjadi bahan refleksi calon guru mengenai kontekstualisasi pembelajaran di wilayah rawan bencana.','Premiere Pro, DaVinci Resolve','https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200','https://example.com/dokumenter-merapi',false),
  ('Poster Seri Kampanye Digital Wellbeing','poster-digital-wellbeing','Nadia Puspita','Desain Grafis','Sepuluh poster kampanye tentang keseimbangan penggunaan gawai bagi remaja dengan sistem grid modular.','Menumbuhkan kesadaran digital wellbeing di lingkungan SMA melalui bahasa visual remaja.','Figma, Photoshop','https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200','https://example.com/digital-wellbeing',false),
  ('LabSim: Simulator Praktikum Kimia Virtual','labsim','Tim Laboratorium TP UNY','Media Pembelajaran','Simulator praktikum kimia berbasis web yang memungkinkan siswa mencampur reagen secara aman.','Memberikan pengalaman praktikum bagi sekolah tanpa laboratorium kimia memadai.','Unity WebGL, C#','https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200','https://example.com/labsim',false)
) as w(title, slug, pname, cname, description, goals, tools, thumb, media, featured)
join public.participants p on p.name = w.pname
join public.categories c on c.name = w.cname;