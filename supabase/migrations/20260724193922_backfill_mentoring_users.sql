-- Bestandskunden-Backfill: für jeden bezahlten Mentoring-Kunden einen Account.
--
-- Datenmigration, keine Schemaänderung. Idempotent – ein zweiter Durchlauf
-- legt nichts doppelt an, weil über lower(email) gegen auth.users geprüft wird.
--
-- Gilt bewusst NUR für appointment_type = 'mentoring'. LiveTrading- und
-- Community-Käufe lösen keinen Account aus.
--
-- Die Accounts entstehen OHNE Passwort (encrypted_password = null). Damit kann
-- sich niemand einloggen, bis er selbst über „Passwort vergessen" eines setzt –
-- genau das ist gewollt, es geht keine Einladungsmail raus. Solange die
-- Passwort-Zurücksetzen-Seite im Frontend fehlt, sind diese Accounts
-- unerreichbar.
--
-- email_confirmed_at wird gesetzt, weil die Adresse über Stripe bereits
-- verifiziert ist. confirmed_at und identities.email sind generierte Spalten
-- und dürfen nicht beschrieben werden.
--
-- WICHTIG – Token-Spalten auf '' statt NULL: GoTrue liest confirmation_token,
-- recovery_token, email_change, email_change_token_new usw. als NON-NULL-String.
-- Bleiben sie NULL (der Spalten-Default!), scheitert JEDER Login/Recovery dieser
-- Accounts mit „500 Database error querying schema / Scan error … converting
-- NULL to string". Ein per SQL angelegter auth.users-Datensatz MUSS diese
-- Spalten daher explizit auf '' setzen. Die GoTrue-Admin-API (Dashboard „Add
-- user", Edge Function) erledigt das automatisch – ein Grund mehr, auf Prod den
-- Weg über das Dashboard zu bevorzugen.
--
-- Auf Prod ist der Weg über Authentication → Users → Add user (mit „Auto
-- Confirm User") gleichwertig und schonender; bei gut einem Dutzend Kunden ist
-- das Handarbeit von wenigen Minuten. Danach nur Teil 2 ausführen.
--
-- Setzt 20260724170252_link_bookings_to_users.sql voraus: Teil 2 schreibt in
-- bookings.user_id.
--
-- STATUS: Auf dem Test-Projekt (nbjnycgprwznxcikocxb) angewendet – 2 Accounts,
--         registriert als Version 20260724193922.
--         Auf dem Produktions-Projekt (sjmfbdnzsktncbwqafjq) NOCH OFFEN.
--         Anzahl vor dem Übertrag zählen, nicht schätzen – siehe README.md.
--
-- Die Telefonnummer landet in raw_user_meta_data, NICHT in der Spalte
-- auth.users.phone: die ist bei Supabase eine Login-Identität für SMS-OTP,
-- hat einen UNIQUE-Index und erwartet E.164. customer_phone kommt aus einem
-- freien Formularfeld und erfüllt das nicht durchgängig.

begin;

-- ── 1. Accounts anlegen ──────────────────────────────────────────────────
with kandidaten as (
  select distinct on (lower(b.customer_email))
         lower(b.customer_email) as email,
         b.customer_name,
         b.customer_phone
  from public.bookings b
  join public.appointments a on a.id = b.appointment_id
  where a.type = 'mentoring'
    and b.status = 'paid'
  -- jüngste Buchung gewinnt: aktuellster Name/Telefon
  order by lower(b.customer_email), b.created_at desc
),
neu as (
  select gen_random_uuid() as id, k.email, k.customer_name, k.customer_phone
  from kandidaten k
  where not exists (select 1 from auth.users u where lower(u.email) = k.email)
),
ins_users as (
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    -- Leere Strings statt NULL – siehe Kopfkommentar, sonst 500 beim Login.
    confirmation_token, recovery_token, email_change, email_change_token_new,
    email_change_token_current, phone_change, phone_change_token,
    reauthentication_token
  )
  select '00000000-0000-0000-0000-000000000000'::uuid, n.id,
         'authenticated', 'authenticated', n.email, null,
         now(), now(), now(),
         '{"provider":"email","providers":["email"]}'::jsonb,
         jsonb_build_object(
           'full_name',      n.customer_name,
           'phone',          n.customer_phone,
           'email_verified', true,
           'source',         'mentoring_backfill'
         ),
         '', '', '', '', '', '', '', ''
  from neu n
  returning id, email
)
-- Ohne identities-Zeile ist der Account für den Email-Provider unvollständig.
insert into auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at)
select i.id::text, i.id,
       jsonb_build_object('sub', i.id::text, 'email', i.email,
                          'email_verified', true, 'phone_verified', false),
       'email', now(), now()
from ins_users i;

-- ── 2. Buchungen verknüpfen ──────────────────────────────────────────────
-- Nicht auf Mentoring eingeschränkt: existiert zu einer Adresse ein Account,
-- gehören ihm alle Buchungen dieser Adresse – auch spätere LiveTrading-Käufe.
update public.bookings b
set user_id = u.id
from auth.users u
where b.user_id is null
  and lower(b.customer_email) = lower(u.email);

commit;

-- ── Kontrolle ────────────────────────────────────────────────────────────
-- Muss 0 ergeben:
--   select count(*) from public.bookings b
--     join public.appointments a on a.id = b.appointment_id
--    where a.type='mentoring' and b.status='paid' and b.user_id is null;
