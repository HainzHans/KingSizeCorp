import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Appointment} from '../../../../shared/models/appointment.model';
import {FormatDatePipe} from '../../../../shared/pipes/formatDatePipe';

@Component({
  selector: 'app-appointment-slot-card',
  standalone: true,
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './appointment-slot-card-component.html',
  styleUrls: ['./appointment-slot-card-component.css'],
})
export class AppointmentSlotCardComponent {
  slot     = input.required<Appointment>();
  selected = input<boolean>(false);

  select = output<Appointment>();

  onSelect(): void {
    this.select.emit(this.slot());
  }
}
