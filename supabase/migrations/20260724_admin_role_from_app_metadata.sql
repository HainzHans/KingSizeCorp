-- Admin-Rolle: eine einzige Quelle für Client und Datenbank.
--
-- Vorher prüften die Policies eine fest verdrahtete User-UUID, während der
-- Angular-Client über eine E-Mail-Allowlist entschied. Beides läuft jetzt über
-- app_metadata.role === 'admin' im JWT.
--
-- Warum app_metadata und nicht user_metadata: user_metadata kann der User über
-- supabase.auth.updateUser() selbst setzen – das wäre eine direkte
-- Rechteausweitung. app_metadata ist nur mit der Service-Role änderbar.
--
-- STATUS: Auf dem Test-Projekt (nbjnycgprwznxcikocxb) bereits angewendet.
--         Auf dem Produktions-Projekt (sjmfbdnzsktncbwqafjq) NOCH OFFEN.
--
-- WICHTIG: Nach dem Ausführen muss sich der Admin einmal neu einloggen.
--          Das JWT wird beim Login ausgestellt; ein bestehendes Token trägt
--          den neuen Claim noch nicht und verliert dadurch den Zugriff.

begin;

-- ── 1. Rolle auf dem Admin-Account setzen ────────────────────────────────
-- UUID des Produktions-Admins (admin@kingsize.de).
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
                        || jsonb_build_object('role', 'admin')
where id = 'da89373c-e4b5-4245-ac76-a38ce9520c8c';

-- ── 2. Helper, den alle Policies verwenden ───────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- ── 3. Policies umstellen ────────────────────────────────────────────────
-- 'to authenticated' statt 'to public': anon kann per Definition kein Admin sein.
-- Die öffentlichen Lese-Policies bleiben unverändert bestehen.

drop policy if exists "Nur Admin-User darf Termine verwalten" on public.appointments;
create policy "Nur Admin-User darf Termine verwalten"
  on public.appointments for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Nur Admin darf Preise verwalten" on public.appointment_prices;
create policy "Nur Admin darf Preise verwalten"
  on public.appointment_prices for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Nur Admin darf Bookings lesen" on public.bookings;
create policy "Nur Admin darf Bookings lesen"
  on public.bookings for select to authenticated
  using (public.is_admin());

drop policy if exists "Nur Admin darf Community-Subscriptions lesen" on public.community_subscriptions;
create policy "Nur Admin darf Community-Subscriptions lesen"
  on public.community_subscriptions for select to authenticated
  using (public.is_admin());

commit;
