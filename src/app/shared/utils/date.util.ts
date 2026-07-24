/**
 * Datums-Helfer für das Format, in dem Supabase liefert und erwartet:
 * date = 'YYYY-MM-DD', time = 'HH:MM[:SS]'.
 *
 * Bewusst ohne toISOString(): das rechnet nach UTC um und verschiebt
 * abends/nachts das Datum um einen Tag.
 */

/** 'YYYY-MM-DD' → 'DD.MM.YYYY' (leerer String, wenn kein Wert vorliegt). */
export function toGermanDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
}

/** Date → 'YYYY-MM-DD' in lokaler Zeitzone. */
export function toIsoDate(date: Date): string {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Date → 'HH:MM' in lokaler Zeitzone. */
export function toIsoTime(date: Date): string {
  const hours   = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/** Heutiges Datum als 'YYYY-MM-DD' in lokaler Zeitzone. */
export function todayIsoDate(): string {
  return toIsoDate(new Date());
}
