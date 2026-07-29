-- Roadlink Trip Control - atomic live-operation transitions
-- Keeps each financially sensitive state change and its audit records together.

create or replace function public.roadlink_client_action(
  p_trip_id text,
  p_action text,
  p_reason text,
  p_actor_email text,
  p_actor_name text,
  p_event_id text,
  p_created_at text
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_trip public.trips%rowtype;
  v_status text;
  v_total numeric := 0;
begin
  if p_action not in ('confirm', 'cancel', 'contact') then raise exception 'Unknown client action.'; end if;
  select * into v_trip from public.trips where id = p_trip_id for update;
  if not found then raise exception 'Trip not found.'; end if;

  select coalesce(sum((item->>'amount')::numeric), 0) into v_total
  from jsonb_array_elements(coalesce(v_trip.budget, '[]'::jsonb)) item;
  v_status := v_trip.status;

  if p_action = 'confirm' then
    if v_trip.status <> 'pending' then raise exception 'This booking is no longer awaiting confirmation.'; end if;
    v_status := 'confirmed';
  elsif p_action = 'cancel' then
    if v_trip.status in ('cancelled', 'needs', 'reconciled') then raise exception 'This booking is already cancelled.'; end if;
    v_status := case when v_total > 0 then 'needs' else 'cancelled' end;
  end if;

  update public.trips
  set status = v_status,
      "cancelledReason" = case when p_action = 'cancel' then p_reason else "cancelledReason" end,
      timeline = coalesce(timeline, '[]'::jsonb) || jsonb_build_array(jsonb_build_object(
        'text', 'Client action recorded: ' || p_action || case when coalesce(p_reason, '') <> '' then '. Reason: ' || p_reason else '' end,
        'at', p_created_at
      )),
      version = version + 1,
      updated_at = now()
  where id = p_trip_id;

  insert into public.client_actions (id, "tripId", action, "actorEmail", reason, "createdAt")
  values (p_event_id, p_trip_id, p_action, p_actor_email, coalesce(p_reason, ''), p_created_at);
  insert into public.audit_events (id, "tripId", actor, action, detail, "createdAt")
  values ('AUD-' || p_event_id, p_trip_id, p_actor_name, 'client_' || p_action, coalesce(nullif(p_reason, ''), 'Secure client link action'), p_created_at);

  if p_action = 'contact' then
    insert into public.notifications (id, role, "tripId", title, body, "createdAt")
    values ('NT-' || p_event_id, 'coordinator', p_trip_id, 'Client requested contact', p_actor_name || ' asked Roadlink to contact them.', p_created_at);
  elsif p_action = 'cancel' and v_total > 0 then
    insert into public.reconciliation_tasks (id, "tripId", status, alert, "createdAt")
    values ('REC-' || p_trip_id, p_trip_id, 'open', 'For Immediate Checking', p_created_at)
    on conflict ("tripId") do nothing;
    insert into public.notifications (id, role, "tripId", title, body, "createdAt") values
      ('NT-' || p_event_id || '-OWNER', 'owner', p_trip_id, 'For Immediate Checking', v_trip.client || ' cancelled ' || v_trip.route || ' after funds were released.', p_created_at),
      ('NT-' || p_event_id || '-FIN', 'accounting', p_trip_id, 'For Immediate Checking', v_trip.client || ' cancelled ' || v_trip.route || ' after funds were released.', p_created_at);
  end if;

  return (select to_jsonb(t) from public.trips t where t.id = p_trip_id);
end;
$$;

create or replace function public.roadlink_waybill_approve(
  p_trip_id text,
  p_signer text,
  p_actor_name text,
  p_event_id text,
  p_created_at text
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_trip public.trips%rowtype;
  v_waybill jsonb;
begin
  if p_signer not in ('manager', 'finance') then raise exception 'Unknown waybill signer.'; end if;
  select * into v_trip from public.trips where id = p_trip_id for update;
  if not found then raise exception 'Trip not found.'; end if;
  v_waybill := coalesce(v_trip.waybill, '{}'::jsonb);

  if p_signer = 'manager' then
    if coalesce(v_waybill->>'status', '') <> 'Submitted' then raise exception 'The coordinator must submit the waybill before manager approval.'; end if;
    v_waybill := jsonb_set(jsonb_set(v_waybill, '{approvedBy}', to_jsonb(p_actor_name)), '{status}', '"Manager Signed"'::jsonb);
    insert into public.notifications (id, role, "tripId", title, body, "createdAt")
    values ('NT-' || p_event_id, 'accounting', p_trip_id, 'Waybill approved', v_trip.route || ' is ready for finance release review.', p_created_at);
  else
    if coalesce(v_waybill->>'approvedBy', '') = '' or coalesce(v_waybill->>'status', '') <> 'Manager Signed' then
      raise exception 'Manager approval is required before finance approval.';
    end if;
    v_waybill := jsonb_set(jsonb_set(v_waybill, '{financeBy}', to_jsonb(p_actor_name)), '{status}', '"Approved"'::jsonb);
  end if;

  update public.trips
  set waybill = v_waybill,
      timeline = coalesce(timeline, '[]'::jsonb) || jsonb_build_array(jsonb_build_object(
        'text', case when p_signer = 'manager' then 'Manager approval added by ' else 'Finance approval added by ' end || p_actor_name,
        'at', p_created_at
      )),
      version = version + 1,
      updated_at = now()
  where id = p_trip_id;
  insert into public.audit_events (id, "tripId", actor, action, detail, "createdAt")
  values ('AUD-' || p_event_id, p_trip_id, p_actor_name, 'waybill_' || p_signer || '_approved', 'Waybill ' || coalesce(v_waybill->>'number', ''), p_created_at);
  return (select to_jsonb(t) from public.trips t where t.id = p_trip_id);
end;
$$;

create or replace function public.roadlink_budget_release(
  p_trip_id text,
  p_item jsonb,
  p_actor_name text,
  p_event_id text,
  p_created_at text
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_trip public.trips%rowtype;
begin
  select * into v_trip from public.trips where id = p_trip_id for update;
  if not found then raise exception 'Trip not found.'; end if;
  if v_trip.status not in ('confirmed', 'funds') then raise exception 'The client must confirm the trip before funds can be released.'; end if;
  if coalesce(v_trip.waybill->>'status', '') <> 'Approved' then raise exception 'Manager and finance approval are required before funds can be released.'; end if;

  update public.trips
  set budget = coalesce(budget, '[]'::jsonb) || jsonb_build_array(p_item),
      status = 'funds',
      timeline = coalesce(timeline, '[]'::jsonb) || jsonb_build_array(jsonb_build_object('text', coalesce(p_item->>'type', 'Budget') || ' release logged by ' || p_actor_name, 'at', p_created_at)),
      version = version + 1,
      updated_at = now()
  where id = p_trip_id;
  insert into public.budget_items (id, "tripId", type, detail, amount, state, "createdAt")
  values (p_item->>'id', p_trip_id, p_item->>'type', coalesce(p_item->>'detail', ''), (p_item->>'amount')::numeric, coalesce(p_item->>'state', 'Logged'), p_created_at);
  insert into public.audit_events (id, "tripId", actor, action, detail, "createdAt")
  values ('AUD-' || p_event_id, p_trip_id, p_actor_name, 'budget_logged', coalesce(p_item->>'type', '') || ': PHP ' || coalesce(p_item->>'amount', '0'), p_created_at);
  return (select to_jsonb(t) from public.trips t where t.id = p_trip_id);
end;
$$;

create or replace function public.roadlink_reconcile(
  p_trip_id text,
  p_reconciliation jsonb,
  p_actor_name text,
  p_event_id text,
  p_created_at text
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_trip public.trips%rowtype;
begin
  select * into v_trip from public.trips where id = p_trip_id for update;
  if not found then raise exception 'Trip not found.'; end if;
  if v_trip.status <> 'needs' then raise exception 'Only trips marked Cancelled - Funds Released can be reconciled.'; end if;
  update public.trips
  set reconciliation = p_reconciliation,
      status = 'reconciled',
      timeline = coalesce(timeline, '[]'::jsonb) || jsonb_build_array(jsonb_build_object('text', 'Accounting marked cancellation funds as reconciled', 'at', p_created_at)),
      version = version + 1,
      updated_at = now()
  where id = p_trip_id;
  update public.reconciliation_tasks
  set status = 'complete', "completedAt" = p_created_at, notes = coalesce(p_reconciliation->>'expensesUsed', '')
  where "tripId" = p_trip_id;
  insert into public.audit_events (id, "tripId", actor, action, detail, "createdAt")
  values ('AUD-' || p_event_id, p_trip_id, p_actor_name, 'reconciliation_completed', coalesce(nullif(p_reconciliation->>'expensesUsed', ''), 'Completed'), p_created_at);
  return (select to_jsonb(t) from public.trips t where t.id = p_trip_id);
end;
$$;

revoke all on function public.roadlink_client_action(text,text,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.roadlink_waybill_approve(text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.roadlink_budget_release(text,jsonb,text,text,text) from public, anon, authenticated;
revoke all on function public.roadlink_reconcile(text,jsonb,text,text,text) from public, anon, authenticated;
grant execute on function public.roadlink_client_action(text,text,text,text,text,text,text) to service_role;
grant execute on function public.roadlink_waybill_approve(text,text,text,text,text) to service_role;
grant execute on function public.roadlink_budget_release(text,jsonb,text,text,text) to service_role;
grant execute on function public.roadlink_reconcile(text,jsonb,text,text,text) to service_role;

notify pgrst, 'reload schema';
