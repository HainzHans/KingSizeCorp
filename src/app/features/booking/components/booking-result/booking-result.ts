import {Component, input} from '@angular/core';
import {GlowButtonComponent} from '../../../../shared/components/glow-button-component/glow-button-component';

@Component({
  selector: 'app-booking-result',
  imports: [
    GlowButtonComponent
  ],
  templateUrl: './booking-result.html',
  styleUrl: './booking-result.css',
})
export class BookingResult {
  status = input.required<'success' | 'cancel'>();
}
