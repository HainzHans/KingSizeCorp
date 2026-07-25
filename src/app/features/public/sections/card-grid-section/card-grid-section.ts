import { Component } from '@angular/core';
import { FeatureCardComponent } from '../../components/feature-card/feature-card';
import { FeatureCard } from '../../../../shared/models/feature-card.model';

@Component({
  selector: 'app-card-grid-section',
  imports: [FeatureCardComponent],
  templateUrl: './card-grid-section.html',
  styleUrl: './card-grid-section.css',
})
export class CardGridSection {
  readonly cards: readonly FeatureCard[] = [
    { icon: 'pi-phone',     title: 'Live-Calls',          text: 'jeden Sonntag wird live die Woche besprochen und analysiert' },
    { icon: 'pi-whatsapp',  title: 'Erreichbarkeit',      text: 'Ich bin 24/7 für Fragen persönlich erreichbar' },
    { icon: 'pi-megaphone', title: 'Ehrliche Worte',      text: 'Ich sage dir ohne Umschweife, wenn du wieder Mist am Markt baust.' },
    { icon: 'pi-heart',     title: 'Fleiß und Disziplin', text: 'Ich bringe dir das mit der nötigen Konsequenz bei, bis es sitzt.' },
    { icon: 'pi-compass',   title: 'Strategie‑Planung',   text: 'Gemeinsam entwickeln wir deinen klaren Fahrplan.' },
    { icon: 'pi-comments',  title: 'Trade‑Feedback',      text: 'Kurzes, ehrliches Feedback zu deinen Trades.' },
  ];
}
