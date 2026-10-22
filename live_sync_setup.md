# EPISTEME live sync setup

The separate admin portal publishes visual edits and structured editor state to `public.episteme_site_content`. The public user portal reads the page-specific `visual_edits_*` records and applies them on page load. Deploy this updated user portal to the existing public Netlify site whenever the runtime or page structure changes.

## Important
- Keep the same Supabase project URL and publishable key in both sites. Never place a service-role key in browser code.
- The `episteme_site_content` table must exist and permit public SELECT for published content, while writes are restricted by RLS to authorized admins.
- Faculty/contact/book structured state is stored under `admin_state_*` keys; the runtime applies supported fields where the public page has matching targets. Use the Visual Canvas editor for general text/layout changes.
- Media binaries require the existing `EPISTEME-admin-media` Storage bucket and `episteme_site_media` registry/policies to be configured. Image metadata alone does not upload the file.
- Existing application submissions are not modified by this sync bridge.
