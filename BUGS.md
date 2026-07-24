# Bekannte Bugs

Gefunden beim Refactoring am 24.07.2026. **Bewusst nicht behoben** – dieses Dokument
beschreibt nur, was falsch ist, damit die Fixes einzeln geplant werden können.

Sortiert nach Schwere. „Verifiziert" heißt: im laufenden Dev-Server bzw. per SQL
gegen die Datenbank nachgewiesen, nicht nur aus dem Code abgeleitet.

---

## B1 · Admin verliert auf Produktion sämtliche Rechte  🔴 Deployment-Blocker

**Wo:** `src/app/shared/services/auth-service/auth-service.ts:70`
· `supabase/migrations/20260724_admin_role_from_app_metadata.sql`

`isAdminUser()` betrachtet nur den, der `app_metadata.role === 'admin'` trägt.

Auf dem **Produktions**-Projekt (`sjmfbdnzsktncbwqafjq`) ist das für niemanden gesetzt:

```
id                                    email               raw_app_meta_data
da89373c-e4b5-4245-ac76-a38ce9520c8c  admin@kingsize.de   {"provider":"email","providers":["email"]}
```

Zusätzlich prüfen die dortigen RLS-Policies weiterhin die fest verdrahtete UUID
(`auth.uid() = 'da89373c-…'`) statt `public.is_admin()`.

**Folge beim Deploy des aktuellen Standes:** `isAdmin()` ist `false`, der Admin-Block
in der Sidebar erscheint nicht mehr, das Dashboard zeigt nur den Mitglieder-Bereich.

**Ursache:** Die Migration ist laut ihrem eigenen Kopfkommentar auf Prod noch offen –
sie wurde bisher nur auf dem Test-Projekt (`nbjnycgprwznxcikocxb`) ausgeführt.

**Zu beachten:** Nach dem Ausführen der Migration muss sich der Admin **einmal neu
einloggen** – der Claim steckt im JWT, ein bestehendes Token trägt ihn noch nicht.

*Verifiziert per SQL gegen beide Supabase-Projekte.*

---

## B2 · Der Anmelden-Button löst zwei Navigationen aus

**Wo:** `src/app/shared/sections/header-section/header-section.html:13-16`
· `src/app/shared/components/king-size-button/king-size-button.ts:17`

```html
<app-king-size-button [btnText]="'Anmelden'" (click)="navigateToLogin()"></app-king-size-button>
```

Der Button bekommt kein `[target]`, navigiert intern aber trotzdem immer selbst –
mit leerem Target, also auf die Startseite. Der Host-Click feuert zusätzlich `/login`.

Ein einziger Klick erzeugt damit:

```
router.navigate([""])        ← aus KingSizeButton.navigateTo()
router.navigate(["/login"])  ← aus HeaderSection.navigateToLogin()
```

Aktuell gewinnt in der Regel die zweite, das Ergebnis stimmt also meistens. Verlassen
sollte man sich darauf nicht: bei einem Testlauf landete der Klick auf `/contact`
stattdessen auf der Startseite.

*Verifiziert: `router.navigate` instrumentiert, beide Aufrufe pro Klick beobachtet.*

---

## B3 · Speicherleck – `router.events`-Subscription wird nie gekündigt

**Wo:** `src/app/shared/components/king-size-button/king-size-button.ts:28-35`

```ts
this.router.navigate([this.target()]).then(() => {
  this.router.events.subscribe(event => {          // ← nie unsubscribed
    if (event instanceof NavigationEnd) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
```

Jeder Klick legt einen weiteren dauerhaften Subscriber an. Nach fünf Klicks: fünf
Subscriber, die **bei jeder künftigen Navigation** ein `scrollTo({top: 0})` auslösen.

Das sabotiert nebenbei das eigentliche Feature: `scrollWithOffset()` scrollt zum
Anker, die Alt-Subscriber ziehen die Seite direkt wieder nach oben.

*Verifiziert: `router.events`-Subscriber vor/nach 5 Klicks gezählt → 0 → 5.*

---

## B4 · Heutige Termine sind nie buchbar

**Wo:** `src/app/features/booking/components/slot-picker/slot-picker.ts:22`
· `src/app/features/admin/sections/admin-appointment-page/admin-appointment-page.ts` (`isAppointmentInFuture`)

```ts
return new Date(date) > new Date();
```

`new Date('2026-07-24')` wird als **Mitternacht UTC** geparst, verglichen wird gegen
den aktuellen Zeitpunkt. Ein Termin heute um 20:00 gilt damit den ganzen Tag über als
Vergangenheit und wird ausgeblendet – obwohl er in der Datenbank noch `available` ist.

Zwei Folgeprobleme in der Admin-Ansicht:

* Der Filter hängt **nur an der Mentoring-Spalte**, LiveTrading zeigt alles an.
* Die Kopfzeile („X Termine") zählt die ausgeblendeten Karten mit, Anzeige und Zahl
  widersprechen sich also.

---

## B5 · Der 409-Sonderfall beim Buchen greift nie

**Wo:** `src/app/features/booking/sections/appointment-form-section/appointment-form-section.ts:171`

```ts
} catch (err: any) {
  if (err?.status === 409) { /* „Termin gerade vergeben" */ }
```

Geworfen wird ein `FunctionsHttpError` aus `supabase.functions.invoke()`. Der trägt
laut `@supabase/functions-js` ein Feld `context` (das `Response`-Objekt) – **kein**
`status`. Die Bedingung ist immer `false`.

**Folge:** Wer einen inzwischen vergebenen Termin bucht, bekommt die generische
Meldung „Es ist ein Fehler aufgetreten" statt des Hinweises samt Rücksprung zur
Terminwahl. Der Code dafür existiert, ist aber unerreichbar.

---

## B6 · Löschen meldet Erfolg, ohne zu löschen

**Wo:** `src/app/shared/services/appointment-service/appointment.service.ts:86-93`

```ts
.delete()
.eq('status', 'available')
.eq('id', id);
```

Ist der Termin inzwischen gebucht, trifft der Filter keine Zeile. Supabase löscht
nichts und liefert **keinen Fehler**. Die UI meldet trotzdem „Gelöscht" und entfernt
die Karte aus der Liste – nach einem Reload ist sie wieder da.

Gleiches Muster in `deleteExpired()`.

---

## B7 · Community-Käufe würden als „Mentoring" gelabelt

**Wo:** `src/app/shared/services/user-service/user.service.ts:38`

```ts
type: appt?.type === 'livetrading' ? 'Live Trading' : 'Mentoring',
```

Der Enum `appointment_type` in der Datenbank kennt drei Werte
(`livetrading`, `mentoring`, `community`). Alles außer `livetrading` wird hier zu
„Mentoring" – auch ein fehlgeschlagener Join, bei dem `appt` `undefined` ist.

*Heute noch nicht sichtbar:* Community-Abos laufen über die Tabelle
`community_subscriptions`, nicht über `bookings`. Sobald sich das ändert, ist die
Admin-Übersicht falsch.

---

## B8 · Aufräumen und Laden konkurrieren

**Wo:** `src/app/features/admin/sections/admin-appointment-page/admin-appointment-page.ts:86`

`deleteExpired()` läuft im selben `Promise.all` wie die beiden Ladeaufrufe. Ob die
Liste abgelaufene Termine noch enthält, hängt davon ab, welcher Request zuerst durch
ist – reiner Zufall.

*Das Refactoring hat die Reihenfolge bewusst unverändert gelassen.*

---

## B9 · Zwei verschiedene Zeitzonen für „heute"

* `appointment.service.ts:96` → `new Date().toISOString().split('T')[0]` (**UTC**)
* `booked-appointment.service.ts` → lokale Zeit (jetzt `todayIsoDate()`)

In Deutschland (UTC+1/+2) liefern beide zwischen 00:00 und 01:00 bzw. 02:00 Ortszeit
**unterschiedliche Tage**. Die eine Stelle löscht dann Termine, die die andere noch
als bevorstehend anzeigt.

---

## B10 · Video-Poster zeigt auf einen Dev-Pfad (404)

**Wo:** `src/app/shared/sections/hero-section/hero-section.html:8`

```html
poster="/src/assets/images/fallback_meteor.png"
```

Im Build liegt die Datei unter `/assets/images/…`; `/src/…` existiert nicht.

**Folge:** Solange das Video lädt (oder wenn Autoplay blockiert wird), bleibt die
Hero-Fläche schwarz statt das Fallback-Bild zu zeigen.

*Verifiziert: `fetch('/src/assets/images/fallback_meteor.png')` → **404**.*

---

## B11 · `CustomerRefSection` schreibt in ein fremdes Stylesheet

**Wo:** `src/app/features/public/sections/customer-ref-section/customer-ref-section.ts:70`

```ts
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(topRule, styleSheet.cssRules.length);
```

Drei Probleme:

1. Welches Stylesheet `[0]` ist, entscheidet die Build-Reihenfolge – im Dev-Server
   waren zur Laufzeit 35 Stylesheets im Dokument.
2. Bei jeder Instanziierung kommen zwei weitere `@keyframes`-Regeln dazu, entfernt
   wird nie eine.
3. Auf ein Stylesheet von einer fremden Origin (CDN) wirft `cssRules` eine
   `SecurityError` – die Komponente bricht dann beim Rendern ab.

---

## B12 · Ungültiges HTML: `<h2>` in `<h2>`

**Wo:** `src/app/features/public/sections/community-section/community-section.html:9-13`

```html
<h2>
  Dein Einstieg <br> in die Welt des <br>
  <h2 class="green-text">Tradings.</h2>
</h2>
```

Überschriften dürfen nicht verschachtelt werden. Der Browser bricht das äußere
Element auf – das Ergebnis sieht zufällig richtig aus, ist aber nicht das, was im
Markup steht.
