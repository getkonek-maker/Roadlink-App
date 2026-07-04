-- Roadlink Trip Control — initial Supabase schema
--
-- Column names are quoted camelCase because server.mjs posts its JSON records
-- directly to PostgREST (tableInsert/tableUpdate) without key mapping. Every
-- table also has a snake_case created_at because tableList orders by
-- `created_at.desc`.
--
-- Run this in the Supabase SQL editor (or `supabase db push`). Safe to run on
-- a fresh project only — it does not drop existing tables.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.clients (
  id text primary key,
  company text not null,
  "authorizedContact" text default '',
  email text default '',
  phone text default '',
  created_at timestamptz not null default now()
);

create table public.profiles (
  id text primary key,
  -- Link to Supabase Auth once production auth is enabled (Phase 4).
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  email text unique not null,
  role text not null check (role in ('admin','owner','coordinator','accounting','client')),
  "roleLabel" text default '',
  username text unique,
  -- Local-demo credential hash. Unused once Supabase Auth is the login path.
  "passwordHash" text default '',
  company text default '',
  phone text default '',
  status text not null default 'active' check (status in ('active','suspended')),
  initials text default '',
  photo text default '',
  created_at timestamptz not null default now()
);

create table public.account_requests (
  id text primary key,
  name text not null,
  email text not null,
  role text not null,
  company text default '',
  phone text default '',
  status text not null default 'Pending',
  "requestedAt" text default '',
  "approvedAt" text default '',
  created_at timestamptz not null default now()
);

create table public.booking_requests (
  id text primary key,
  "clientId" text default '',
  company text default '',
  contact text default '',
  email text default '',
  phone text default '',
  origin text default '',
  destination text default '',
  vehicle text default '',
  date text default '',
  cargo text default '',
  status text not null default 'Needs staff review',
  "createdAt" text default '',
  created_at timestamptz not null default now()
);

create table public.trips (
  id text primary key,
  client text default '',
  contact text default '',
  phone text default '',
  email text default '',
  route text default '',
  origin text default '',
  destination text default '',
  vehicle text default '',
  date text default '',
  cargo text default '',
  coordinator text default '',
  "preferredChannel" text default 'Email',
  status text not null default 'pending'
    check (status in ('pending','confirmed','funds','cancelled','needs','reconciled')),
  "cancelledReason" text default '',
  "clientToken" text not null,
  "clientTokenExpiresAt" text not null,
  waybill jsonb not null default '{}',
  budget jsonb not null default '[]',
  reconciliation jsonb not null default '{"cashReturned":false,"chequeVoided":false,"poCancelled":false,"expensesUsed":""}',
  timeline jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table public.budget_items (
  id text primary key,
  "tripId" text not null references public.trips(id),
  type text not null,
  detail text default '',
  amount numeric not null default 0 check (amount >= 0),
  state text not null default 'Logged',
  "createdAt" text default '',
  created_at timestamptz not null default now()
);

create table public.client_actions (
  id text primary key,
  "tripId" text not null references public.trips(id),
  action text not null check (action in ('confirm','cancel','contact')),
  "actorEmail" text default '',
  reason text default '',
  "createdAt" text default '',
  created_at timestamptz not null default now()
);

create table public.reconciliation_tasks (
  id text primary key,
  "tripId" text not null references public.trips(id),
  status text not null default 'open' check (status in ('open','complete')),
  alert text default '',
  notes text default '',
  "completedAt" text default '',
  "createdAt" text default '',
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id text primary key,
  "tripId" text default '',
  actor text default 'System',
  action text not null,
  detail text default '',
  "createdAt" text default '',
  created_at timestamptz not null default now()
);

create table public.notifications (
  id text primary key,
  role text default '',
  "tripId" text default '',
  title text default '',
  body text default '',
  read boolean not null default false,
  "createdAt" text default '',
  created_at timestamptz not null default now()
);

create table public.sheet_sync_log (
  id text primary key,
  kind text default '',
  status text default '',
  message text default '',
  "createdAt" text default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Append-only audit trail
--
-- RLS does NOT bind on the service-role key, but ordinary table privileges do.
-- Revoking UPDATE/DELETE from service_role is what makes these tables
-- genuinely append-only for the app server.
-- ---------------------------------------------------------------------------

revoke update, delete on public.audit_events from service_role, authenticated, anon;
revoke update, delete on public.sheet_sync_log from service_role, authenticated, anon;
revoke update, delete on public.client_actions from service_role, authenticated, anon;

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The browser never queries Supabase directly (all reads/writes go through
-- server.mjs with the service-role key, which bypasses RLS). Enabling RLS
-- with zero policies means the anon/authenticated keys are fully denied by
-- default — defense-in-depth if the anon key ever leaks into client code.
-- ---------------------------------------------------------------------------

alter table public.clients enable row level security;
alter table public.profiles enable row level security;
alter table public.account_requests enable row level security;
alter table public.booking_requests enable row level security;
alter table public.trips enable row level security;
alter table public.budget_items enable row level security;
alter table public.client_actions enable row level security;
alter table public.reconciliation_tasks enable row level security;
alter table public.audit_events enable row level security;
alter table public.notifications enable row level security;
alter table public.sheet_sync_log enable row level security;

-- ---------------------------------------------------------------------------
-- Helpful indexes
-- ---------------------------------------------------------------------------

create index trips_status_idx on public.trips (status);
create index trips_client_idx on public.trips (client);
create index budget_items_trip_idx on public.budget_items ("tripId");
create index client_actions_trip_idx on public.client_actions ("tripId");
create index audit_events_trip_idx on public.audit_events ("tripId");
create index notifications_role_idx on public.notifications (role);
create index booking_requests_company_idx on public.booking_requests (company);

-- ---------------------------------------------------------------------------
-- Optional: seed staff profiles for the internal pilot (local-demo style
-- logins while Supabase Auth is being set up). Replace THE_PEPPER with the
-- exact PASSWORD_PEPPER value from the server environment, and replace the
-- passwords before running. Delete these rows once Supabase Auth is live.
-- ---------------------------------------------------------------------------

-- insert into public.profiles (id, name, email, role, "roleLabel", username, "passwordHash", company, status, initials)
-- values
--   ('USR-OWNER', 'Emmanuel Garces', 'owner@roadlink.ph', 'owner', 'Owner / Manager', 'owner.roadlink',
--    encode(digest('THE_PEPPER:CHANGE_ME_STRONG_PASSWORD', 'sha256'), 'hex'), 'Roadlink', 'active', 'EG');
