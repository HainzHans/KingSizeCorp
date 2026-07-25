import { Component, input } from '@angular/core';

/** Eine einzelne Kundenstimme (Name + Sterne-Bewertung) im Referenz-Slider. */
@Component({
  selector: 'app-customer-ref-card',
  standalone: true,
  templateUrl: './customer-ref-card.html',
  styleUrl: './customer-ref-card.css',
})
export class CustomerRefCardComponent {
  readonly name   = input.required<string>();
  readonly review = input.required<number>();

  /** Feste 5-Sterne-Skala zum Iterieren im Template. */
  readonly stars = [1, 2, 3, 4, 5];
}
