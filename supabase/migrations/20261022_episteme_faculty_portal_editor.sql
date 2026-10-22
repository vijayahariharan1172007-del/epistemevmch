-- EPISTEME Faculty In-Charges Portal editor data key
-- Non-destructive: this only inserts an empty starter document if the key is absent.
-- Existing applications, messages, and faculty data are not deleted or overwritten.
insert into public.episteme_site_content (content_key, content_value, updated_at)
values ('admin_state_faculty_portal', '{"version":1,"sections":[]}'::text, now())
on conflict (content_key) do nothing;

-- Public read access should already be provided by the existing EPISTEME site-content policy.
-- Keep authenticated admin write policies in place; do not expose service-role keys in browser code.
