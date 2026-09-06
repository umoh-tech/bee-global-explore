-- ============================================================================
-- Bee Global Explore — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New Query → paste → Run
-- ============================================================================

-- 1. Submissions table -------------------------------------------------------
-- One table holds every form type (flights, hotels, visa, packages, school,
-- passport, transfers, goods, general enquiry). `service_type` says which
-- form it came from; `details` holds the fields specific to that form.

create table if not exists public.submissions (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  service_type   text not null,
  full_name      text,
  phone          text,
  email          text,
  details        jsonb not null default '{}'::jsonb,
  file_paths     text[] not null default '{}',
  status         text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  source         text not null default 'website'
);

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);
create index if not exists submissions_service_type_idx on public.submissions (service_type);
create index if not exists submissions_status_idx on public.submissions (status);

-- Row Level Security ----------------------------------------------------------
-- The public website NEVER talks to Supabase directly — it posts to our own
-- /api/submit serverless function, which uses the SERVICE ROLE key (which
-- bypasses RLS entirely). So we do NOT need an "insert" policy for anon users.
-- We only need policies for the admin dashboard, which signs in with
-- Supabase Auth as the one owner account and reads/updates directly.

alter table public.submissions enable row level security;

-- Change this email if you want a different admin login.
drop policy if exists "Admin can view all submissions" on public.submissions;
create policy "Admin can view all submissions"
  on public.submissions for select
  using (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com');

drop policy if exists "Admin can update submissions" on public.submissions;
create policy "Admin can update submissions"
  on public.submissions for update
  using (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com')
  with check (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com');

drop policy if exists "Admin can delete submissions" on public.submissions;
create policy "Admin can delete submissions"
  on public.submissions for delete
  using (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com');

-- No insert policy for anyone via the client — inserts come only from
-- the serverless function's service-role key, which bypasses RLS by design.


-- 2. Holiday packages table ---------------------------------------------------
-- Lets the admin add/edit/hide packages from the dashboard instead of
-- editing code. The public site reads active packages directly (anon key +
-- RLS), the same way any public read-only content would.

create table if not exists public.packages (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  from_price    numeric not null default 0,
  includes      text[] not null default '{}',
  blurb         text not null default '',
  itinerary     text[] not null default '{}',
  is_active     boolean not null default true,
  sort_order    integer not null default 0
);

create index if not exists packages_sort_order_idx on public.packages (sort_order);

alter table public.packages enable row level security;

-- Anyone (the public website) can read only the packages marked active.
drop policy if exists "Public can view active packages" on public.packages;
create policy "Public can view active packages"
  on public.packages for select
  using (is_active = true);

-- Only the admin can see inactive/hidden packages, and add/edit/delete any.
drop policy if exists "Admin can view all packages" on public.packages;
create policy "Admin can view all packages"
  on public.packages for select
  using (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com');

drop policy if exists "Admin can insert packages" on public.packages;
create policy "Admin can insert packages"
  on public.packages for insert
  with check (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com');

drop policy if exists "Admin can update packages" on public.packages;
create policy "Admin can update packages"
  on public.packages for update
  using (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com')
  with check (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com');

drop policy if exists "Admin can delete packages" on public.packages;
create policy "Admin can delete packages"
  on public.packages for delete
  using (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com');

-- Seed with the original 6 sample packages so the site isn't empty on launch.
-- Safe to run more than once — it only inserts if the table is empty.
insert into public.packages (name, from_price, includes, blurb, itinerary, sort_order)
select * from (values
  ('Dubai 5-Day Getaway', 850000, array['Flight','Hotel','Airport Transfer','City Tour'],
   'Desert safaris, skyline views, and world-class shopping — a fast, well-organized introduction to Dubai.',
   array['Arrival & airport transfer to hotel','Half-day city tour: Burj Khalifa & Dubai Mall','Desert safari with dinner','Free day for shopping or optional excursions','Departure transfer'], 1),
  ('Zanzibar Beach Escape', 1150000, array['Flight','Hotel','Airport Transfer','Spice Tour'],
   'White-sand beaches, turquoise water, and Stone Town history for a relaxed island break.',
   array['Arrival & beachfront hotel check-in','Stone Town historical walking tour','Spice farm tour','Free beach days','Departure transfer'], 2),
  ('Paris City Getaway', 1650000, array['Flight','Hotel','Airport Transfer','City Tour'],
   'Iconic landmarks and cafe culture — a classic first-timer''s introduction to Paris.',
   array['Arrival & airport transfer','Eiffel Tower & Seine river cruise','Louvre & city walking tour','Free day for shopping/exploring','Departure transfer'], 3),
  ('London City Break', 1800000, array['Flight','Hotel','Airport Transfer','City Tour'],
   'History, museums, and West End energy on a well-paced city break.',
   array['Arrival & airport transfer','Westminster & London Eye tour','Museum day (free entry venues)','Free day for shopping/exploring','Departure transfer'], 4),
  ('Bali Adventure', 1950000, array['Flight','Hotel','Airport Transfer','Tours'],
   'Temples, rice terraces, and beach time across one of Southeast Asia''s most loved islands.',
   array['Arrival & airport transfer','Ubud rice terrace & temple tour','Beach day at Seminyak/Kuta','Optional water sports excursion','Departure transfer'], 5),
  ('Cape Town Explorer', 1400000, array['Flight','Hotel','Airport Transfer','Tours'],
   'Table Mountain, coastal drives, and winelands on a scenic South African break.',
   array['Arrival & airport transfer','Table Mountain & city tour','Cape Peninsula scenic drive','Winelands day trip','Departure transfer'], 6)
) as seed(name, from_price, includes, blurb, itinerary, sort_order)
where not exists (select 1 from public.packages);


-- 3. Storage bucket for uploaded documents ------------------------------------
-- Private bucket — files are never publicly reachable by URL. The admin
-- dashboard generates short-lived signed URLs to view them.

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Only the admin (signed in) can read files. Uploads happen only via the
-- serverless function's service-role key, which bypasses these policies.

drop policy if exists "Admin can view documents" on storage.objects;
create policy "Admin can view documents"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com'
  );

-- ============================================================================
-- Done. Next steps:
--   1. Authentication → Users → Add user → create the admin login
--      (use beeglobalexplore@gmail.com, or change the email above to match
--      whichever address you want to use, BEFORE running this script).
--   2. Project Settings → API → copy the Project URL, anon public key, and
--      service_role key — you'll need these for Vercel environment variables
--      and the admin dashboard config.
-- ============================================================================
