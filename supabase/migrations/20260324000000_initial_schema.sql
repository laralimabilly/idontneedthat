-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tags
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  short_description text,
  price decimal(10, 2) not null,
  currency text not null default 'USD',
  image_url text,
  image_alt text,
  additional_images text[],
  affiliate_url text not null,
  store text not null,
  affiliate_network text,
  affiliate_tag text,
  category_id uuid references categories(id) on delete set null,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Product-Tags join table
create table product_tags (
  product_id uuid not null references products(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

-- Click events for affiliate tracking
create table click_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  referrer text,
  user_agent text,
  ip_hash text,
  country text,
  device_type text,
  source_page text,
  created_at timestamptz not null default now()
);

-- Admin users (references auth.users)
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null
);

-- Site settings (key-value store)
create table site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

-- Indexes
create index idx_products_category on products(category_id);
create index idx_products_published on products(is_published);
create index idx_products_featured on products(is_featured);
create index idx_products_slug on products(slug);
create index idx_categories_slug on categories(slug);
create index idx_tags_slug on tags(slug);
create index idx_click_events_product on click_events(product_id);
create index idx_click_events_created on click_events(created_at);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger categories_updated_at
  before update on categories
  for each row execute function update_updated_at();

create trigger tags_updated_at
  before update on tags
  for each row execute function update_updated_at();

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- RLS Policies
alter table categories enable row level security;
alter table tags enable row level security;
alter table products enable row level security;
alter table product_tags enable row level security;
alter table click_events enable row level security;
alter table admin_users enable row level security;
alter table site_settings enable row level security;

-- Helper: check if current user is admin
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from admin_users where id = (select auth.uid())
  );
end;
$$ language plpgsql security definer;

-- Categories: public read, admin write
create policy "categories_public_read" on categories
  for select using (true);
create policy "categories_admin_insert" on categories
  for insert with check (is_admin());
create policy "categories_admin_update" on categories
  for update using (is_admin());
create policy "categories_admin_delete" on categories
  for delete using (is_admin());

-- Tags: public read, admin write
create policy "tags_public_read" on tags
  for select using (true);
create policy "tags_admin_insert" on tags
  for insert with check (is_admin());
create policy "tags_admin_update" on tags
  for update using (is_admin());
create policy "tags_admin_delete" on tags
  for delete using (is_admin());

-- Products: public read (published only), admin full access
create policy "products_public_read" on products
  for select using (is_published = true or is_admin());
create policy "products_admin_insert" on products
  for insert with check (is_admin());
create policy "products_admin_update" on products
  for update using (is_admin());
create policy "products_admin_delete" on products
  for delete using (is_admin());

-- Product tags: public read, admin write
create policy "product_tags_public_read" on product_tags
  for select using (true);
create policy "product_tags_admin_insert" on product_tags
  for insert with check (is_admin());
create policy "product_tags_admin_delete" on product_tags
  for delete using (is_admin());

-- Click events: anonymous insert, admin read
create policy "click_events_anon_insert" on click_events
  for insert with check (true);
create policy "click_events_admin_read" on click_events
  for select using (is_admin());

-- Admin users: admin read only
create policy "admin_users_admin_read" on admin_users
  for select using (is_admin());

-- Site settings: public read, admin write
create policy "site_settings_public_read" on site_settings
  for select using (true);
create policy "site_settings_admin_insert" on site_settings
  for insert with check (is_admin());
create policy "site_settings_admin_update" on site_settings
  for update using (is_admin());
