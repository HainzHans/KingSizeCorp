import {Component, input, output} from '@angular/core';
import {Appointment} from '../../../../shared/models/appointment.model';
import {AppointmentSlotCardComponent} from '../appointment-slot-card-component/appointment-slot-card-component';

@Component({
  selector: 'app-slot-picker',
  imports: [
    AppointmentSlotCardComponent
  ],
  templateUrl: './slot-picker.html',
  styleUrl: './slot-picker.css',
})
export class SlotPicker {

  slots = input.required<Appointment[]>();
  selectedSlot = input<Appointment | undefined>(undefined);
  loading = input<boolean>(false);

  slotSelected = output<Appointment>();

  isSlotInFuture(date: string): boolean {
    return new Date(date) > new Date();
  }

}
