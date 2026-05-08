import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

@Component({
  selector: 'app-faq-section',
  imports: [
    NgClass,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent
  ],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.css',
})
export class FaqSection {

  questions = [
    {
      title: 'Für wen ist das Mentoring?',
      text: `Für Menschen, die bereits investiert haben — Zeit, Geld, Energie — und trotzdem noch nicht dort stehen, wo sie wollen. Die viel gelernt haben, aber keinen Weg sehen, daraus konstant Geld zu verdienen. Die frustriert sind, zweifeln oder das Gefühl haben, alles versucht zu haben. Wenn du dich darin wiedererkennst, bist du hier richtig.

Was du mitbringen solltest:
Ich suche keine Hoffnungslosen — ich suche Menschen mit Verantwortung. Du solltest bereit sein, diszipliniert zu arbeiten, Verantwortung für deine Ergebnisse zu übernehmen, Kritik anzunehmen und verstehen, dass Trading ein Prozess ist — keine Abkürzung. Ich verspreche dir keinen schnellen Reichtum. Ich verspreche dir Struktur, Klarheit und ein System, das nachvollziehbar ist.

Was ich nicht anbiete:
Keine Signale. Kein Copy & Paste. Keine unrealistischen Versprechen. Wer einen schnellen Ausweg sucht, ist hier falsch. Wer bereit ist, diszipliniert zu lernen und umzusetzen, dem kann ich helfen — wieder Struktur und Perspektive zu bekommen.`,
      value: 0
    },
    {
      title: 'Wie viel Zeit muss ich investieren?',
      text: `Dieses Mentoring hat kein festes Zeitlimit — ich arbeite ausschließlich 1:1, jeden Termin individuell auf dich abgestimmt. Kein Gruppenprogramm, kein Standardkurs, kein Druck durch feste Laufzeiten. Wir arbeiten zusammen, bis du strukturiert und eigenständig handelst und deine erste Auszahlung erzielt hast. Das ist kein Versprechen auf schnellen Erfolg — das ist ein Commitment zu einem echten Prozess.

Was du mitbringen musst:
Tägliche Chart-Zeit von mindestens 1–2 Stunden, Disziplin auch außerhalb unserer Calls, die Bereitschaft Fehler ehrlich zu analysieren, mentale Stabilität und Geduld. Wer einen schnellen Ausweg sucht, ist hier falsch. Wer bereit ist, strukturiert zu arbeiten und Verantwortung zu übernehmen, ist hier richtig.`,
      value: 1
    },
    {
      title: 'Warum KingSize Corp - Marcel Dichter?',
      text: `Ich nehme nur Menschen auf, die es ernst meinen. Ich bleibe an deiner Seite, korrigiere dich und fordere dich — aber ich werde dich nicht tragen. Trading ist kein Glücksspiel. Es ist ein Skill. Und Skills brauchen Zeit.

Klartext:
Ich verspreche dir kein Geld — ich verspreche dir Struktur. Keine Abkürzung — aber einen klaren Weg. Und wenn du bereit bist, diesen Weg konsequent zu gehen, arbeiten wir, bis du ihn alleine gehen kannst.`,
      value: 2
    },
    {
      title: 'Was kostet das Mentoring?',
      text: `1:1 Mentoring – 1.200 €

      Einmaliges Investment — keine Raten, keine versteckten Kosten, keine Folgekosten.

Ich arbeite nur mit wenigen Personen gleichzeitig. Wenn alle Plätze belegt sind, ist eine direkte Buchung nicht möglich.

Wichtig vor der Buchung:
Dieses Mentoring ist kein Motivationsprogramm, kein Signal-Service und keine Garantie auf Gewinne — es ist strukturierte Arbeit. Wer bereit ist, Verantwortung zu übernehmen und diszipliniert zu handeln, kann sich seinen Platz sichern. Wer nach Abkürzungen sucht, ist hier falsch.`,
      value: 3
    },
    {
      title: 'Was passiert nach der Buchung?',
      text: `Nach deiner Zahlung erhältst du sofort eine Bestätigungs-Mail mit allen weiteren Informationen.

Vor dem ersten Call:
Du füllst ein kurzes Formular aus — Erfahrungsstand, bisherige Fehler, Ziele und aktuelle Struktur. So starten wir vom ersten Termin an effizient und gezielt.

Im ersten Call:
Wir klären deine aktuelle Struktur, definieren klare Regeln, setzen einen konkreten Plan und identifizieren Schwachstellen. Ab diesem Punkt beginnt die strukturierte Zusammenarbeit.

Die laufende Zusammenarbeit:
Regelmäßige 1:1 Sessions, Trade-Analysen, Korrekturen, mentale Arbeit und Struktur-Optimierung — ohne Zeitlimit, bis du eigenständig und stabil handeln kannst.

Dieses Mentoring ist keine einmalige Beratung. Es ist eine Begleitung mit klarer Struktur und echtem Anspruch.`,
      value: 4
    },
  ];

  openedFAQ: number = 0;

  toggleFAQ(index: number) {
    this.openedFAQ = this.openedFAQ === index ? -1 : index;
  }
}
