-- Roadlink Trip Control - retryable transactional email outbox

create table if not exists public.email_outbox (
  id text primary key,
  kind text not null check (kind in ('confirmation', 'waybill')),
  "tripId" text not null references public.trips(id),
  recipient text not null,
  status text not null default 'queued' check (status in ('queued', 'failed', 'sent', 'dead')),
  attempts integer not null default 0 check (attempts >= 0),
  "nextAttemptAt" timestamptz not null default now(),
  "lastError" text default '',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.email_outbox enable row level security;
create index if not exists email_outbox_due_idx on public.email_outbox (status, "nextAttemptAt");
create unique index if not exists email_outbox_active_trip_kind_unique
  on public.email_outbox ("tripId", kind)
  where status in ('queued', 'failed');

revoke all on public.email_outbox from anon, authenticated;
grant select, insert, update on public.email_outbox to service_role;

notify pgrst, 'reload schema';
