# EPISTEME Unified Wizarding Site — latest repairs

- Root `index.html` remains the Marauder's Map homepage.
- Fixed the destination click handling so local pages navigate normally.
- Join EPISTEME opens the embedded joining portal; direct `#join-portal` links are supported.
- Opening the Marauder's Map now displays a Dobby-style full-screen loading overlay first.
- Added a shared EPISTEME logo + name header and a Dobby-themed destination menu (menu only; no AI chat).
- Removed the old visible navigation bars from About and Contacts in favour of the shared header.
- About page now uses the transparent white owl image from the joining portal instead of a full-page background image.
- Core Coordinators menu trigger is renamed from “Ask Dobby” to “EPISTEME MENU”.
- Contact page lists the supplied email, Instagram handle, and mobile number; sends success/failure overlays and a small sending indicator.
- Joining form shows a small sending indicator during database submission.
- Supabase config remains the existing project's browser-safe publishable configuration; no service-role key was added.

## Validation performed
- ZIP structure checked after packaging.
- 38 inline JavaScript blocks passed Node syntax checks.
- Relative local href/src targets in root HTML pages checked: no missing targets found.

## Still requires live testing after deployment
- Submit a test membership application and verify it appears in Supabase.
- Submit a test contact message and verify it appears in Supabase.
- Confirm the site on its final Netlify domain and test mobile layouts.
- The contact form saves to Supabase; it does not itself send an email to the contact inbox.
