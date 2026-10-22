# EPISTEME user portal — Supabase visual edit runtime

This package includes `visual-edits-runtime.js` in the public pages. It reads published overrides from `public.episteme_site_content` using keys such as `visual_edits_home`, `visual_edits_about`, and `visual_edits_contacts`.

Deploy this updated user portal to the **existing public Netlify site** so changes published from the separate EPISTEME Admin Portal can appear on the live pages. Keep the Supabase URL and publishable key in `supabase-config.js`; never add a service-role key to the browser.

The runtime only reads public content. Publishing is restricted by the existing Supabase RLS policies to authenticated users listed in `public.episteme_admins`. It does not modify membership applications or contact submissions.
