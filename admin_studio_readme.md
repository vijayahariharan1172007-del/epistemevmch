# EPISTEME Admin Studio

Open `admin.html` on the deployed EPISTEME site (for example, `https://epistemevmch.in/admin.html`). Sign in using an existing authorized Supabase Auth admin email/password. The page does not create admin accounts or embed a service-role key.

## What it does
- Edits the top Faculty In-Charge profile.
- Adds, edits, hides/shows, removes and reorders patrons for ARTERA, REVELA, COGNITIVA and VIVARA.
- Uploads portraits directly to the existing `episteme-admin-media` Storage bucket and publishes profile image URLs.
- Replaces ASTRA gallery images, the existing four faculty image slots, and core-member placeholder slots by updating `episteme_site_media`.
- Publishes the faculty data to `episteme_site_content` key `admin_state_faculty_portal`.

## Required existing Supabase setup
- `supabase-config.js` points at the intended project and contains only a publishable key.
- `episteme_site_content` allows SELECT for the public page and authenticated admin upsert under the existing RLS policies.
- `episteme_site_media` permits authenticated admin upsert for `media_key`, `storage_path`, and `updated_at`.
- Storage bucket `episteme-admin-media` is public for reads and allows authenticated authorized admins to upload files.
- The signed-in account must be permitted by the project's admin policies (including `public.episteme_admins` if used by the project).

If the UI reports an RLS/permission error, fix the existing Supabase policies/admin membership; do not place a service-role key in this page. A public upload policy is not recommended.

## Deployment
Upload the new `admin.html` and updated `faculty-incharges.html` alongside the existing site files in the same Netlify deploy. Keep the rest of the ZIP contents and existing `supabase-config.js` unchanged. The admin URL is not linked from the public navigation, but authentication/RLS—not URL secrecy—must protect writes.
