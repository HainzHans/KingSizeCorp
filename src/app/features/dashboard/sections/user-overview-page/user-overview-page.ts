import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberBookingService } from '../../../../shared/services/member-booking-service/member-booking.service';
import { MemberBooking } from '../../../../shared/models/member-booking.model';

/** Mitgliederbereich: zeigt dem eingeloggten User seine eigenen Buchungen. */
@Component({
  selector: 'app-user-overview-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-overview-page.html',
  styleUrl: './user-overview-page.css',
})
export class UserOverviewPage implements OnInit {
  private bookingService = inject(MemberBookingService);

  readonly bookings = signal<MemberBooking[]>([]);
  readonly loading  = signal(true);
  readonly failed   = signal(false);

  async ngOnInit() {
    try {
      this.bookings.set(await this.bookingService.getMyBookings());
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
