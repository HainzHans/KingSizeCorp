-- Buchung ↔ Account: die dauerhafte Verknüpfung.
--
-- Bisher war die einzige Kundenidentität der Text in bookings.customer_email.
-- Ab jetzt zeigt user_id auf den Account. Die drei customer_*-Spalten bleiben
-- in diesem Schritt bewusst unberührt – create-checkout schreibt sie vor der
-- Zahlung, zu einem Zeitpunkt, an dem es noch keinen Account gibt. Sie können
-- erst fallen, wenn der Checkout-Flow die Kontaktdaten über die
-- Stripe-Session-Metadata transportiert (so wie create-community-checkout es
-- heute schon macht).
--
-- on delete set null, nicht cascade: eine Buchung ist ein Geschäftsvorgang und
-- muss das Löschen eines Accounts überleben.
--
-- STATUS: Auf dem Test-Projekt (nbjnycgprwznxcikocxb) angewendet
--         als Version 20260724170252.
--         Auf dem Produktions-Projekt (sjmfbdnzsktncbwqafjq) NOCH OFFEN.
--
-- Keine Vorbedingung: diese Migration verwendet nur auth.uid(), nicht
-- public.is_admin(). Sie läuft auf Prod unabhängig davon, ob
-- 20260724152611_admin_role_from_app_metadata.sql schon gelaufen ist. Die dort
-- noch fest verdrahtete Admin-Policy bleibt daneben bestehen – RLS verknüpft
-- mehrere Policies mit OR.

begin;

-- ── 1. Verknüpfung ───────────────────────────────────────────────────────
alter table public.bookings
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists bookings_user_id_idx on public.bookings(user_id);

-- ── 2. Eigene Buchungen lesbar machen ────────────────────────────────────
-- Ergänzt die bestehende Admin-Policy; RLS verknüpft mehrere Policies mit OR.
-- Nur SELECT: Ändern und Löschen bleibt Admin bzw. Service-Role.
drop policy if exists "User darf eigene Buchungen lesen" on public.bookings;
create policy "User darf eigene Buchungen lesen"
  on public.bookings for select to authenticated
  using (user_id = auth.uid());

commit;
