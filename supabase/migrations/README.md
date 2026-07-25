# Datenbank & Edge Functions – Prod-Übertrag

Zwei Supabase-Projekte, identisches Schema:

| Rolle | Projekt | Ref |
|---|---|---|
| Test | KigSizeCorp-Test | `nbjnycgprwznxcikocxb` |
| **Produktion** | KigSizeCorp | `sjmfbdnzsktncbwqafjq` |

Der Dateiname jeder Migration entspricht der Version, unter der sie in
`supabase_migrations.schema_migrations` registriert ist. Alles wird **zuerst auf
Test** angewendet, dann auf Prod.

Dieses Feature besteht aus drei Teilen, die zusammengehören:
**(A) Migrationen**, **(B) Edge Functions**, **(C) Auth-Konfiguration im
Dashboard**. Für Prod müssen alle drei nachgezogen werden.

---

## A · Migrationen

### Stand 24.07.2026

| Version | Migration | Test | Prod |
|---|---|---|---|
| 20260507093231 | add_community_enum_value | ✅ | ✅ |
| 20260507093257 | add_community_table_and_price | ✅ | ✅ |
| 20260508083714 | add_stripe_customer_id_to_community_subscriptions | ✅ | ✅ |
| 20260724152611 | admin_role_from_app_metadata | ✅ | ❌ **offen** |
| 20260724170252 | link_bookings_to_users | ✅ | ❌ offen |
| 20260724193922 | backfill_mentoring_users | ✅ | ❌ offen |
| 20260724195730 | add_auth_user_lookup | ✅ | ❌ offen |
| 20260724201417 | allow_read_own_booked_appointments | ✅ | ❌ offen |
| 20260724205003 | add_recordings | ✅ | ❌ offen |

> **Lücke:** Für die drei Migrationen von Mai gibt es keine `.sql`-Datei im Repo.
> Sie sind auf beiden Projekten angewendet, aber der Ordner ist damit keine
> vollständige Historie der Datenbank.

### Reihenfolge & Abhängigkeiten

Die offenen Migrationen in Dateinamen-Reihenfolge anwenden. Abhängigkeiten:

- `backfill_mentoring_users` setzt `link_bookings_to_users` voraus (schreibt in
  `bookings.user_id`).
- `add_auth_user_lookup` und `allow_read_own_booked_appointments` sind
  unabhängig, werden aber von den Edge Functions bzw. vom Mitgliederbereich
  gebraucht – vor dem Deploy von Teil B/C anwenden.

#### 1. `admin_role_from_app_metadata` — Deployment-Blocker

Unabhängig vom Nutzerkonten-Feature, aber [B1](../../BUGS.md) blockiert das
Deployment: ohne diese Migration verliert der Admin auf Prod sämtliche Rechte.
Danach muss sich der Admin **einmal neu einloggen** – der Claim steckt im JWT.

#### 2. `link_bookings_to_users`

Fügt `bookings.user_id` (FK auf `auth.users`, `on delete set null`) und die
Policy „User darf eigene Buchungen lesen" hinzu. Additiv, keine Vorbedingung.

#### 3. `backfill_mentoring_users`

Legt für jeden bezahlten Mentoring-Kunden einen Account an und verknüpft die
Buchungen. Idempotent. Anzahl vor dem Übertrag **zählen**, nicht schätzen:

```sql
select count(distinct lower(b.customer_email)) as anzulegende_accounts
  from public.bookings b
  join public.appointments a on a.id = b.appointment_id
 where a.type = 'mentoring' and b.status = 'paid'
   and not exists (select 1 from auth.users u
                    where lower(u.email) = lower(b.customer_email));
```

> **⚠️ Token-Spalten-Falle (in der Migration bereits behoben).** Ein per SQL in
> `auth.users` eingefügter Datensatz muss `confirmation_token`, `recovery_token`,
> `email_change`, `email_change_token_new` u. a. auf **`''`** setzen, nicht auf
> NULL. Sonst scheitert JEDER Login/Recovery dieser Accounts mit
> „500 Database error querying schema". Die Migrationsdatei setzt die leeren
> Strings; auf Test wurden die zuerst falsch angelegten Zeilen nachträglich per
> `coalesce(... , '')` repariert. Auf Prod tritt das Problem nicht auf, wenn die
> **aktuelle** Migrationsdatei verwendet wird.

**Schonendere Alternative auf Prod:** Accounts über Authentication → Users →
*Add user* → *Create new user* mit „Auto Confirm User" von Hand anlegen (nicht
*Send invitation*). Die GoTrue-Admin-API setzt die Token-Spalten korrekt, die
Falle oben entfällt. Danach nur **Teil 2** der Migration (Verknüpfung) ausführen.

#### 4. `add_auth_user_lookup`

`security definer`-Funktion `public.auth_user_by_email(text)`, nur für
`service_role`. Der `stripe-webhook` findet damit zu einer E-Mail den Account
und ob er schon ein Passwort hat. **Vor** dem Webhook-Deploy anwenden.

#### 5. `allow_read_own_booked_appointments`

Policy, damit ein User die Termine seiner eigenen Buchungen lesen darf. Ohne sie
zeigt der Mitgliederbereich Buchungen ohne Termindetails (Datum/Preis leer), weil
die öffentliche Lese-Policy nur `status='available'` erlaubt, gebuchte Termine
aber `booked` sind.

#### 6. `add_recordings`

Tabelle `public.recordings` (Zoom-Aufzeichnungen) plus die `security definer`-
Funktion `public.is_mentoring_member()`. RLS: Admin verwaltet alles, jedes
zahlende Mentoring-Mitglied darf lesen. Setzt `is_admin` (152611) und
`bookings.user_id` (170252) voraus. Speist den Dashboard-Menüpunkt
„Aufzeichnungen".

---

## B · Edge Functions

Liegen jetzt im Repo unter [`supabase/functions/`](../functions). Auf Prod per
Dashboard oder CLI deployen. Alle nötigen Secrets (`APP_URL`, `RESEND_API_KEY`,
`FROM_EMAIL`, `SUPABASE_SERVICE_ROLE_KEY` …) sind projektweit bereits gesetzt –
`APP_URL` wird schon von `create-community-checkout` genutzt.

| Function | Änderung | verify_jwt |
|---|---|---|
| `stripe-webhook` | Idempotenz-Guard; legt bei bezahltem **Mentoring** einen Account an, verknüpft `user_id`, hängt einen „Passwort setzen"-Link an die Bestätigungsmail | **false** (Stripe ruft ohne JWT) |
| `request-password-reset` | **neu** – „Passwort vergessen": Recovery-Link via Resend, verrät nie ob die Adresse existiert | true |

> `stripe-webhook` muss `verify_jwt=false` behalten. `APP_URL` muss auf den
> **richtigen** Origin des jeweiligen Projekts zeigen, weil daraus der
> Passwort-setzen-Link (`${APP_URL}/passwort-setzen`) gebaut wird.

---

## C · Auth-Konfiguration (Dashboard → Authentication → URL Configuration)

**Ohne diesen Schritt landet kein Passwort-Link auf der richtigen Seite.** Der
Recovery-Link redirected auf `${APP_URL}/passwort-setzen`; diese URL muss
erlaubt sein, sonst fällt GoTrue auf die Site-URL zurück.

- **Site URL:** der Origin der App (Prod-Domain bzw. auf Test `http://localhost:4200`).
- **Redirect URLs (Allowlist):** zusätzlich `…/passwort-setzen` eintragen, für
  jeden genutzten Origin (Prod-Domain und ggf. `http://localhost:4200/passwort-setzen`
  für lokale Tests).

Diese Einstellung ist **pro Projekt** und über die MCP-Tools nicht setzbar –
manuell im Dashboard.

---

## Kontrolle nach dem Übertrag

```sql
-- Muss 0 ergeben: kein bezahlter Mentoring-Kunde ohne Account
select count(*) from public.bookings b
  join public.appointments a on a.id = b.appointment_id
 where a.type = 'mentoring' and b.status = 'paid' and b.user_id is null;

-- Backfill-Accounts: bestätigt, mit identities-Zeile, Token-Spalten NICHT null
select u.email,
       u.email_confirmed_at is not null                      as bestaetigt,
       u.confirmation_token is not null                      as token_ok,
       (select count(*) from auth.identities i
         where i.user_id = u.id and i.provider = 'email')    as identities,
       (select count(*) from public.bookings b
         where b.user_id = u.id)                             as buchungen
  from auth.users u
 where u.raw_user_meta_data->>'source' = 'mentoring_backfill';
```

RLS-Policy prüfen, ohne sich einloggen zu müssen – muss genau die eigenen
Buchungen liefern:

```sql
begin;
select set_config('request.jwt.claims',
  json_build_object('sub', (select id from auth.users where email = 'KUNDE@BEISPIEL.DE'),
                    'role', 'authenticated')::text, true);
set local role authenticated;
select customer_email, user_id from public.bookings;
rollback;
```

Ein echter End-to-End-Login lässt sich auf Test erzwingen, indem man einem
Backfill-Account testweise ein Passwort setzt:

```sql
update auth.users set encrypted_password = crypt('EINPASSWORT', gen_salt('bf'))
 where email = 'KUNDE@BEISPIEL.DE';
```

---

## Rücknahme

```sql
-- allow_read_own_booked_appointments
drop policy if exists "User darf Termine der eigenen Buchungen lesen" on public.appointments;

-- add_auth_user_lookup
drop function if exists public.auth_user_by_email(text);

-- backfill_mentoring_users – nur die vom Backfill erzeugten Accounts,
-- erkennbar am Marker. Buchungen bleiben (on delete set null).
delete from auth.users where raw_user_meta_data->>'source' = 'mentoring_backfill';

-- link_bookings_to_users
drop policy if exists "User darf eigene Buchungen lesen" on public.bookings;
alter table public.bookings drop column if exists user_id;
```

---

## Noch nicht umgesetzt

`bookings.customer_name`, `customer_email` und `customer_phone` sollen entfallen,
sobald die Kundendaten am Account hängen. Das geht **nicht** allein per Migration:

1. `create-checkout` schreibt die Spalten vor der Zahlung, wenn es noch keinen
   Account gibt → Kontaktdaten müssten in die Stripe-Session-Metadata
   (`create-community-checkout` macht das bereits so).
2. `stripe-webhook` liest `customer_email`/`customer_name` für beide Mails.
3. Die Admin-Übersicht ([user.service.ts](../../src/app/shared/services/user-service/user.service.ts))
   selektiert genau diese Spalten. `auth.users` ist vom Client nicht erreichbar –
   es braucht eine `security definer`-Funktion für Admins oder eine `profiles`-Tabelle.

`create-checkout` und `create-community-checkout` liegen noch nicht im Repo; ihr
Code existiert nur deployed.
