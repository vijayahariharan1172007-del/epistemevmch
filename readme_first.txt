EPISTEME — UNIFIED WIZARDING WEBSITE

Open index.html to start at the Marauder’s Map. A shared Dobby loading screen appears across the main pages, with a matching transition when navigating between pages. The Dobby destination menu is retained.

Included pages:
- index.html — Marauder’s Map / main landing page
- about.html and contacts.html — About and Send an Owl portal
- wings.html — Four Wings portal
- events.html — Explore Events
- prophet.html — EPISTEME Prophet
- game.html — Wizarding Trial / golden ball game
- dobby-menu-demo.html and magical-loading-demo.html — original standalone UI references

Assets and original folders are retained. Upload the complete folder to a static host (or keep its directory structure intact). Do not upload individual HTML files without the shared-assets folder and nested assets.

PRIVATE OWNER CHECKLIST (not shown to website visitors):
- ASTRA destination: astra.html is present; verify its interactive gallery in a real browser before launch.
- Join EPISTEME: the Dobby menu points to the embedded #join-portal section on the Marauder’s Map page.
- Contact and joining forms now use the existing EXCELSIOR@2026 Supabase project. See REPAIR_NOTES.md and supabase/migrations/20261020_episteme_public_forms.sql.

JOIN EPISTEME PORTAL
The main Marauder's Map Join EPISTEME button opens the integrated joining portal from:
  join-EPISTEME/index.html
Keep the join-EPISTEME folder and its assets, styles.css, app.js, and config.js together when uploading the full site.
The root supabase-config.js contains the project URL and browser-safe publishable key. No environment variables are required for this static site. Deploy the complete folder, keeping the directory structure intact. The joining form uses the official wing names COGNITIVA, VIVARA, REVELA, and ARTERA.

SEPARATE ADMIN PORTAL
- The main-site package intentionally excludes admin.html and admin-only files. Deploy the separate EPISTEME_ADMIN_ONLY.zip on the admin host.
- The shared site-media.js bridge reads the public media registry so ASTRA gallery images, core-team portraits, ASTRA faculty portraits, and the final faculty page in each wing book can display admin-managed overrides.
- Apply the admin migration from the separate admin package before using media uploads. The media bridge safely keeps original local images when no replacement exists.
