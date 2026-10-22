create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('contact', 'project')),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  company text not null default '' check (char_length(company) <= 160),
  message text not null check (char_length(message) between 10 and 1000),
  project_type text,
  features text[] not null default '{}',
  contact_preference text,
  budget text not null default '',
  timing text not null default '',
  status text not null default 'new' check (status in ('new', 'reviewing', 'responded', 'closed')),
  constraint project_details_required check (
    kind <> 'project' or (
      project_type is not null and
      char_length(message) >= 15 and
      cardinality(features) > 0 and
      contact_preference is not null
    )
  )
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_created_at_idx on public.inquiries (status, created_at desc);

alter table public.inquiries enable row level security;
revoke all on table public.inquiries from public, anon, authenticated;
grant insert on table public.inquiries to service_role;

comment on table public.inquiries is 'Private customer contact and project requests. Public browser roles have no access; submissions are accepted through the server API.';
