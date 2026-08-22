alter table public.participants rename column cohort to class;
alter table public.works rename column tools to media_tools;
alter table public.works add column external_link text;

alter table public.categories alter column slug drop not null;
alter table public.works alter column slug drop not null;

create or replace function public.slugify(_text text)
returns text language sql immutable set search_path = public as $$
  select trim(both '-' from regexp_replace(lower(coalesce(_text,'')), '[^a-z0-9]+', '-', 'g'))
$$;
revoke execute on function public.slugify(text) from public, anon, authenticated;

create or replace function public.ensure_slug()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := public.slugify(coalesce(new.title, new.name)) || '-' || substr(replace(new.id::text,'-',''), 1, 6);
  end if;
  return new;
end; $$;
revoke execute on function public.ensure_slug() from public, anon, authenticated;

create trigger categories_slug before insert or update on public.categories
  for each row execute function public.ensure_slug();
create trigger works_slug before insert or update on public.works
  for each row execute function public.ensure_slug();