create extension if not exists pgcrypto;

create table if not exists public.join_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  role text not null,
  interests text[] not null default '{}',
  message text not null default '',
  source text not null default 'website',
  status text not null default 'submitted',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  reviewed_at timestamptz,
  contacted_at timestamptz,
  resolved_at timestamptz,
  archived_at timestamptz,
  delete_after timestamptz,
  constraint join_applications_status_check check (
    status in (
      'submitted',
      'reviewing',
      'contacted',
      'accepted',
      'waitlisted',
      'withdrawn',
      'spam',
      'archived'
    )
  )
);

alter table public.join_applications enable row level security;

create index if not exists join_applications_status_created_at_idx
  on public.join_applications (status, created_at desc);

create index if not exists join_applications_last_activity_at_idx
  on public.join_applications (last_activity_at desc);

create index if not exists join_applications_delete_after_idx
  on public.join_applications (delete_after)
  where delete_after is not null;

create index if not exists join_applications_source_idx
  on public.join_applications (source);

create index if not exists join_applications_interests_gin_idx
  on public.join_applications using gin (interests);

create or replace function public.set_join_applications_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if new.status is distinct from old.status then
    new.last_activity_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists trg_join_applications_updated_at on public.join_applications;

create trigger trg_join_applications_updated_at
before update on public.join_applications
for each row
execute function public.set_join_applications_updated_at();

create or replace function public.archive_stale_join_applications(
  stale_after interval default interval '90 days'
)
returns integer
language plpgsql
as $$
declare
  affected_count integer;
begin
  update public.join_applications
  set
    status = 'archived',
    archived_at = coalesce(archived_at, now()),
    resolved_at = coalesce(resolved_at, now()),
    last_activity_at = now()
  where status in ('submitted', 'reviewing', 'contacted', 'waitlisted')
    and last_activity_at < now() - stale_after;

  get diagnostics affected_count = row_count;
  return affected_count;
end;
$$;

comment on table public.join_applications is
'Community join applications. Use status + archived_at/delete_after for lifecycle management.';

comment on column public.join_applications.metadata is
'Flexible extension field for low-frequency additions such as UTM, experiment tags, or referral context.';

drop policy if exists "Allow public submit join applications" on public.join_applications;

create policy "Allow public submit join applications"
on public.join_applications
for insert
to anon, authenticated
with check (
  status = 'submitted'
);
