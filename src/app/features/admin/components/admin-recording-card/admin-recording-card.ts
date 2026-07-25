import { Component, input, output } from '@angular/core';
import { Recording } from '../../../../shared/models/recording.model';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';

/** Eine Zeile in der Admin-Aufzeichnungsliste mit Bearbeiten/Löschen. */
@Component({
  selector: 'app-admin-recording-card',
  standalone: true,
  imports: [FormatDatePipe],
  templateUrl: './admin-recording-card.html',
  styleUrl: './admin-recording-card.css',
})
export class AdminRecordingCardComponent {
  readonly recording = input.required<Recording>();

  readonly edit   = output<void>();
  readonly delete = output<Event>();
}
