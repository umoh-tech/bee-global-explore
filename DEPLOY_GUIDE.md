# Bee Global Explore — Backend Deployment Guide

Everything here is browser-based — no terminal needed, matching how you set up Inkself.

You'll end up with:
- **Main site** — your existing 10 pages, now saving every form submission to a real database.
- **Admin dashboard** — a separate, password-protected site at `admin.beeglobal.com` where you view and manage submissions. It is not linked anywhere on the public site.

---

## Part 1 — Set up Supabase (the database)

1. Go to [supabase.com](https://supabase.com) → sign in → **New Project**.
   - Name it something like `bee-global-explore`.
   - Set a strong database password and save it somewhere safe.
   - Pick a region close to Nigeria (e.g. Europe) for faster load times.

2. Once the project finishes provisioning, open **SQL Editor** (left sidebar) → **New Query**.

3. Open `supabase/schema.sql` from this project, copy its full contents, paste into the SQL Editor, and click **Run**.
   - This creates the `submissions` table, the private `documents` storage bucket, and the security rules that let only you (the admin) read the data.
   - **Before running it**, if you want your admin login to be an email other than `beeglobalexplore@gmail.com`, find the two `auth.jwt() ->> 'email' = ...` lines in the file and change the email first.

4. Create your admin login: **Authentication** (left sidebar) → **Users** → **Add User** → **Create new user**.
   - Use the same email you set in step 3.
   - Set a password — this is what you'll use to sign into `admin.beeglobal.com`.
   - Leave "Auto Confirm User" checked so you don't need to click an email confirmation link.

5. Get your API credentials: **Project Settings** (gear icon) → **API**.
   - Copy the **Project URL** (e.g. `https://xxxxxxxx.supabase.co`)
   - Copy the **anon public** key
   - Copy the **service_role** key (click "reveal" — keep this one secret, never put it in any file that goes to the browser)

Keep this tab open — you'll need all three values in the next parts.

---

## Part 2 — Push the code to GitHub

1. Go to [github.com](https://github.com) → **New repository** → name it `bee-global-explore`.
2. On the new repo's page, click **uploading an existing file** (or **Add file → Upload files**).
3. Drag in every file and folder from this project **except** `node_modules` (don't upload that folder — Vercel installs it automatically from `package.json`).
4. Commit the upload.

---

## Part 3 — Deploy the main site (Vercel Project #1)

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → **Import** your `bee-global-explore` GitHub repo.
2. **Root Directory**: leave as `.` (the repo root) — this project serves the public pages and the `/api/submit` function.
3. Before clicking Deploy, expand **Environment Variables** and add:
   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | your Project URL from Part 1 |
   | `SUPABASE_SERVICE_ROLE_KEY` | your service_role key from Part 1 |
4. Click **Deploy**.
5. Once deployed, visit the Vercel-given URL (e.g. `bee-global-explore.vercel.app`) and submit a test enquiry through the site to confirm it works.
6. If you have the `beeglobal.com` domain: **Project Settings → Domains** → add `beeglobal.com` and `www.beeglobal.com`, then follow Vercel's DNS instructions at your domain registrar.

---

## Part 4 — Deploy the admin dashboard (Vercel Project #2)

The admin dashboard is a *separate* Vercel project pointing at the same repo's `admin` folder, so it gets its own domain and stays completely separate from the public site.

1. Before deploying, fill in your Supabase credentials in the admin code:
   - Open `admin/assets/js/admin.js`
   - Replace `YOUR_SUPABASE_PROJECT_URL` with your Project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your **anon public** key (not the service_role key — the anon key is meant to be public; Row Level Security is what keeps the data locked down)
   - Save, and re-upload this file to GitHub (or edit it directly in the GitHub web editor — pencil icon on the file page).

2. Go to Vercel → **Add New → Project** → import the **same** `bee-global-explore` repo again (Vercel allows importing one repo into multiple projects).
3. **Root Directory**: click Edit and set it to `admin`.
4. No environment variables needed here.
5. Click **Deploy**.
6. Once deployed, visit the given URL and confirm you can sign in with the admin email/password you created in Part 1, and that your test submission from Part 3 shows up.
7. Add your subdomain: **Project Settings → Domains** → add `admin.beeglobal.com` → follow Vercel's DNS instructions (usually a CNAME record) at wherever `beeglobal.com`'s DNS is managed.

---

## How it all fits together

- Every form on the public site posts to `/api/submit`, a serverless function that runs on Vercel.
- That function uses the **service_role key** (kept secret, server-side only) to insert the submission into Supabase and upload any attached documents to private storage.
- The browser on the public site never talks to Supabase directly and never sees any Supabase keys.
- The admin dashboard signs in with **Supabase Auth** as your one owner account, and Row Level Security policies mean only that signed-in account can read or update the `submissions` table or view uploaded documents.
- If the `/api/submit` call ever fails (server hiccup, no internet momentarily), the form automatically falls back to opening the visitor's email app pre-filled, plus a WhatsApp button — so no lead is silently lost.

## Updating the site later

Any time you want to change the public site or admin dashboard: edit the files, re-upload/commit to the same GitHub repo, and both Vercel projects redeploy automatically within a minute or two.
