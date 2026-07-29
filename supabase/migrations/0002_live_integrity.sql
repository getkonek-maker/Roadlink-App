-- Roadlink Trip Control - live operations integrity hardening
-- Apply after 0001_init.sql and before deploying the matching server release.

alter table public.trips
  alter column "clientToken" drop not null,
  alter column "clientToken" set default '',
  add column if not exists "clientTokenHash" text not null default '',
  add column if not exists version integer not null default 1,
  add column if not exists updated_at timestamptz not null default now();

alter table public.profiles
  add column if not exists "sessionVersion" integer not null default 0,
  add column if not exists "clientId" text references public.clients(id);

alter table public.trips
  add column if not exists "clientId" text references public.clients(id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'trips_version_positive'
      and conrelid = 'public.trips'::regclass
  ) then
    alter table public.trips
      add constraint trips_version_positive check (version > 0);
  end if;
end
$$;

create unique index if not exists reconciliation_tasks_trip_unique
  on public.reconciliation_tasks ("tripId");

-- Preserve the newest pending request when a pilot/demo database already has
-- duplicate requests for the same email. Older requests remain in the audit
-- history but cannot be approved accidentally.
with ranked_pending_requests as (
  select id,
    row_number() over (partition by lower(email) order by created_at desc, id desc) as request_rank
  from public.account_requests
  where status = 'Pending'
)
update public.account_requests
set status = 'Superseded'
where id in (
  select id
  from ranked_pending_requests
  where request_rank > 1
);

create unique index if not exists account_requests_pending_email_unique
  on public.account_requests (lower(email))
  where status = 'Pending';

create table if not exists public.password_reset_tokens (
  id text primary key,
  email text not null,
  "codeHash" text not null,
  attempts integer not null default 0,
  "expiresAt" timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.password_reset_tokens enable row level security;
revoke update, delete on public.client_actions from service_role, authenticated, anon;

create index if not exists password_reset_tokens_email_idx
  on public.password_reset_tokens (lower(email), created_at desc);

-- Existing plaintext client tokens remain valid temporarily. The next time a
-- confirmation email is sent, server.mjs rotates the link and stores only the
-- HMAC hash in clientTokenHash. After all active links have rotated, clear the
-- legacy values with:
-- update public.trips set "clientToken" = '' where "clientTokenHash" <> '';
