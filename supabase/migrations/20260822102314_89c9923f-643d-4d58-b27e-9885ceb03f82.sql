alter table public.works alter column description drop not null;
alter table public.works alter column description drop default;
alter table public.works alter column participant_id drop not null;
alter table public.works alter column category_id drop not null;