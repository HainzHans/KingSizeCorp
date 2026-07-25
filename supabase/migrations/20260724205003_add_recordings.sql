-- Zoom-Aufzeichnungen: geordnete Ablage im Mitgliederbereich.
--
-- Bisher gingen die Aufzeichnungen der Gruppen-Mentoring-Calls per WhatsApp an
-- alle Teilnehmer. Diese Tabelle sammelt sie stattdessen an einem Ort: der
-- Admin legt Titel, Datum, Zoom-Link und Passwort an, jedes zahlende
-- Mentoring-Mitglied sieht alle Aufzeichnungen.
--
-- STATUS: Auf dem Test-Projekt (nbjnycgprwznxcikocxb) angewendet
--         als Version 20260724205003.
--         Auf dem Produktions-Projekt (sjmfbdnzsktncbwqafjq) NOCH OFFEN.
--
-- Vorbedingung: braucht public.is_admin() (aus 20260724152611) sowie
-- bookings.user_id (aus 20260724170252). Beide vor dieser Migration anwenden.

begin;

-- ── 1. Tabelle ───────────────────────────────────────────────────────────
create table if not exists public.recordings (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  recorded_on date not null,
  zoom_url    text not null,
  passcode    text,
  description text,
  created_at  timestamptz not null default now()
);

alter table public.recordings enable row level security;

-- Sortierung im Mitgliederbereich: neueste zuerst.
create index if not exists recordings_recorded_on_idx
  on public.recordings (recorded_on desc);

-- ── 2. Wer ist Mentoring-Mitglied? ───────────────────────────────────────
-- security definer, damit die Prüfung nicht selbst wieder an den bookings-/
-- appointments-RLS-Policies hängt. Parallel zu public.is_admin().
-- Mitglied = hat mindestens eine bezahlte Mentoring-Buchung.
create or replace function public.is_mentoring_member()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.bookings b
    join public.appointments a on a.id = b.appointment_id
    where b.user_id = auth.uid()
      and a.type = 'mentoring'
      and b.status = 'paid'
  );
$$;

revoke all on function public.is_mentoring_member() from public;
grant execute on function public.is_mentoring_member() to authenticated;

-- ── 3. Policies ──────────────────────────────────────────────────────────
-- Admin: volle Verwaltung (anlegen/bearbeiten/löschen/lesen).
drop policy if exists "Admin darf Aufzeichnungen verwalten" on public.recordings;
create policy "Admin darf Aufzeichnungen verwalten"
  on public.recordings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Mentoring-Mitglieder: nur lesen.
drop policy if exists "Mentoring-Mitglieder duerfen Aufzeichnungen lesen" on public.recordings;
create policy "Mentoring-Mitglieder duerfen Aufzeichnungen lesen"
  on public.recordings for select to authenticated
  using (public.is_mentoring_member());

commit;

-- ── Rücknahme ────────────────────────────────────────────────────────────
-- drop table if exists public.recordings;
-- drop function if exists public.is_mentoring_member();
