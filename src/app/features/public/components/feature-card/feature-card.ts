import { Component, input } from '@angular/core';

/** Eine einzelne Leistungs-Karte (Icon, Titel, Beschreibung). */
@Component({
  selector: 'app-feature-card',
  standalone: true,
  templateUrl: './feature-card.html',
  styleUrl: './feature-card.css',
})
export class FeatureCardComponent {
  /** PrimeIcons-Klasse ohne Präfix, z. B. 'pi-phone'. */
  readonly icon  = input.required<string>();
  readonly title = input.required<string>();
  readonly text  = input.required<string>();
}
