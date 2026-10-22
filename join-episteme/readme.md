# EPISTEME Members Joining Portal

Responsive static portal for joining EPISTEME or one or more of its four Wings. All form submissions use the shared Supabase client configuration in `../supabase-config.js`; no Google Apps Script or Google Sheets endpoint is used.

## Files
- `index.html`, `styles.css`, `app.js`, `config.js`: portal UI and behavior
- `assets/`: portal artwork
- `../supabase-config.js`: shared Supabase project URL and publishable key

## Supabase
The portal loads `@supabase/supabase-js` and `../supabase-config.js`. The shared config already contains the project's URL and publishable key; do not add an Apps Script URL.

Membership and wing applications are inserted into `episteme_membership_applications`. The table must have an INSERT policy for the `anon` role that validates the expected fields. Keep Row Level Security enabled. Never put a Supabase `service_role` or other secret key in browser code.

## Publish and verify
Deploy the `episteme_refine` folder to your static host, preserving the folder structure and relative paths. Submit one test membership and one test wing application, then confirm each row appears in the Supabase table. Also test on mobile and check the browser console/network panel if a submission fails.

## Stored fields
Reference ID, membership type, full name, mobile number, batch of study, selected wings, and source.
