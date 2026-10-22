-- Additive migration only: creates new EPISTEME public-form tables.
-- Existing EXCELSIOR@2026 tables and data are not modified or deleted.
create table if not exists public.episteme_membership_applications (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique check (char_length(reference_id) between 6 and 40),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 100),
  mobile text not null check (mobile ~ '^[6-9][0-9]{9}$'),
  year_of_study text not null check (char_length(year_of_study) between 1 and 30),
  application_type text not null check (application_type in ('Wings','Episteme Membership')),
  wings text[] not null default '{}',
  source text not null default 'Episteme Joining Portal',
  submitted_at timestamptz not null default now(),
  constraint episteme_wings_selection_check check (
    (application_type = 'Wings' and cardinality(wings) >= 1 and wings <@ array['Cognitiva','Vivara','Revela','Artera']::text[])
    or (application_type = 'Episteme Membership' and cardinality(wings) = 0)
  )
);
alter table public.episteme_membership_applications enable row level security;
revoke all on public.episteme_membership_applications from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant insert on public.episteme_membership_applications to anon, authenticated;
drop policy if exists "Public can submit episteme membership applications" on public.episteme_membership_applications;
create policy "Public can submit episteme membership applications"
on public.episteme_membership_applications for insert to anon, authenticated
with check (
  char_length(btrim(full_name)) between 2 and 100
  and mobile ~ '^[6-9][0-9]{9}$'
  and char_length(year_of_study) between 1 and 30
  and application_type in ('Wings','Episteme Membership')
);

create table if not exists public.episteme_contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 100),
  email text not null check (char_length(email) between 5 and 254 and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  subject text not null check (subject in ('General enquiry','Event or registration','Collaboration','Join EPISTEME','Wings of EPISTEME','Other')),
  message text not null check (char_length(btrim(message)) between 5 and 5000),
  submitted_at timestamptz not null default now()
);
alter table public.episteme_contact_messages enable row level security;
revoke all on public.episteme_contact_messages from anon, authenticated;
grant insert on public.episteme_contact_messages to anon, authenticated;
drop policy if exists "Public can submit episteme contact messages" on public.episteme_contact_messages;
create policy "Public can submit episteme contact messages"
on public.episteme_contact_messages for insert to anon, authenticated
with check (
  char_length(btrim(full_name)) between 2 and 100
  and char_length(email) between 5 and 254
  and subject in ('General enquiry','Event or registration','Collaboration','Join EPISTEME','Wings of EPISTEME','Other')
  and char_length(btrim(message)) between 5 and 5000
);
