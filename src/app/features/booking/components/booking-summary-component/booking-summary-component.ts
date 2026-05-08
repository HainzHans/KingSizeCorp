import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Appointment} from '../../../../shared/models/appointment.model';
import {FormatDatePipe} from '../../../../shared/pipes/formatDatePipe';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './booking-summary-component.html',
  styleUrls: ['./booking-summary-component.css'],
})
export class BookingSummaryComponent {
  product  = input.required<'livetrading' | 'mentoring' | 'community' | null>();
  fullName = input.required<string>();
  phone    = input.required<string>();
  email    = input.required<string>();
  slot     = input.required<Appointment | undefined>();

  productLabel = computed(() => {
    switch (this.product()) {
      case 'livetrading': return 'Live Trading';
      case 'mentoring':   return 'Mentoring';
      case 'community':   return 'KingSize Community';
      default:            return '';
    }
  });

  priceLabel = computed(() => {
    switch (this.product()) {
      case 'livetrading': return '€ 150 / Session';
      case 'mentoring':   return '€ 1200 / LifeTime';
      case 'community':   return '€ 50 / Monat';
      default:            return '';
    }
  });
}
