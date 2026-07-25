-- Nachschlagefunktion für den stripe-webhook.
--
-- Der Webhook muss bei einer bezahlten Mentoring-Buchung entscheiden:
--   • existiert zur Kunden-E-Mail schon ein Account?  → dann NICHT neu anlegen
--   • hat dieser Account bereits ein Passwort?          → dann KEINEN
--     Passwort-setzen-Link in die Mail (er würde ein gesetztes Passwort
--     stillschweigend entwerten)
--
-- auth.users ist über PostgREST/den normalen Zugriff nicht lesbar. Diese
-- Funktion kapselt genau die zwei benötigten Felder – nicht mehr.
--
-- security definer + Ausführungsrecht NUR service_role: anon/authenticated
-- dürfen die Funktion nicht aufrufen. Sonst wäre sie ein Kanal, über den man
-- die Existenz beliebiger Konten abfragen könnte (Account Enumeration).
--
-- STATUS: Auf dem Test-Projekt (nbjnycgprwznxcikocxb) angewendet
--         als Version 20260724195730.
--         Auf dem Produktions-Projekt (sjmfbdnzsktncbwqafjq) NOCH OFFEN.

create or replace function public.auth_user_by_email(p_email text)
returns table(id uuid, has_password boolean)
language sql
stable
security definer
set search_path = auth, pg_temp
as $$
  select u.id,
         (u.encrypted_password is not null and u.encrypted_password <> '')
  from auth.users u
  where lower(u.email) = lower(p_email)
  limit 1;
$$;

revoke all on function public.auth_user_by_email(text) from public, anon, authenticated;
grant execute on function public.auth_user_by_email(text) to service_role;
