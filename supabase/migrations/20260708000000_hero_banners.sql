-- Hero banners for the public homepage carousel
create table hero_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  badge text,
  image_url text,
  cta_label text,
  cta_url text,
  theme text not null default 'neon-green',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_hero_banners_active on hero_banners(is_active);
create index idx_hero_banners_order on hero_banners(display_order);

create trigger hero_banners_updated_at
  before update on hero_banners
  for each row execute function update_updated_at();

alter table hero_banners enable row level security;

-- Public read (active only), admin full access
create policy "hero_banners_public_read" on hero_banners
  for select using (is_active = true or is_admin());
create policy "hero_banners_admin_insert" on hero_banners
  for insert with check (is_admin());
create policy "hero_banners_admin_update" on hero_banners
  for update using (is_admin());
create policy "hero_banners_admin_delete" on hero_banners
  for delete using (is_admin());
