create policy "admins manage karya files"
  on storage.objects for all to authenticated
  using (bucket_id = 'karya' and public.has_role(auth.uid(),'admin'))
  with check (bucket_id = 'karya' and public.has_role(auth.uid(),'admin'));