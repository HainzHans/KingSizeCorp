import {Component, input, output} from '@angular/core';
import {Appointment} from '../../../../shared/models/appointment.model';
import {AppointmentSlotCardComponent} from '../appointment-slot-card-component/appointment-slot-card-component';
import {todayIsoDate} from '../../../../shared/utils/date.util';

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
    // date ist 'YYYY-MM-DD'. Direkter String-Vergleich gegen das lokale
    // heutige Datum – so bleiben Termine vom heutigen Tag den ganzen Tag
    // buchbar (new Date('YYYY-MM-DD') würde als Mitternacht UTC parsen und
    // heutige Termine abends fälschlich als Vergangenheit werten).
    return date >= todayIsoDate();
  }

}
