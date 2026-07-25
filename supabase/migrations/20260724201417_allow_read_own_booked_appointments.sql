-- Ein User darf die Termine lesen, die zu seinen eigenen Buchungen gehören.
--
-- Ohne diese Policy liefert der Join bookings→appointments im Mitgliederbereich
-- NULL, sobald der Termin auf 'booked' steht: die bestehende öffentliche
-- Lese-Policy greift nur bei status='available'. Die Folge im UI wäre eine
-- Buchung ohne Datum/Uhrzeit/Preis.
--
-- Additiv – ergänzt die bestehenden appointments-Policies (RLS verknüpft mit OR).
-- Keine Rekursion: die Policy liest bookings, bookings liest keine appointments.
--
-- STATUS: Auf dem Test-Projekt (nbjnycgprwznxcikocxb) angewendet
--         als Version 20260724201417.
--         Auf dem Produktions-Projekt (sjmfbdnzsktncbwqafjq) NOCH OFFEN.

drop policy if exists "User darf Termine der eigenen Buchungen lesen" on public.appointments;
create policy "User darf Termine der eigenen Buchungen lesen"
  on public.appointments for select to authenticated
  using (
    exists (
      select 1 from public.bookings b
      where b.appointment_id = appointments.id
        and b.user_id = auth.uid()
    )
  );
