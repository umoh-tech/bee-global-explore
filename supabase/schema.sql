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
create policy "Admin can view all submissions"
  on public.submissions for select
  using (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com');

create policy "Admin can update submissions"
  on public.submissions for update
  using (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com')
  with check (auth.jwt() ->> 'email' = 'beeglobalexplore@gmail.com');

-- No insert/delete policy for anyone via the client — inserts come only from
-- the serverless function's service-role key, which bypasses RLS by design.


-- 2. Storage bucket for uploaded documents ------------------------------------
-- Private bucket — files are never publicly reachable by URL. The admin
-- dashboard generates short-lived signed URLs to view them.

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Only the admin (signed in) can read files. Uploads happen only via the
-- serverless function's service-role key, which bypasses these policies.

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
