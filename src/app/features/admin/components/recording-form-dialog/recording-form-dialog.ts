import { Component, computed, effect, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { Recording, CreateRecordingDto } from '../../../../shared/models/recording.model';
import { toIsoDate } from '../../../../shared/utils/date.util';

/**
 * Dialog zum Anlegen/Bearbeiten einer Aufzeichnung. Kapselt den Formular-
 * zustand: befüllt sich beim Öffnen aus `recording` (null = neu anlegen),
 * validiert selbst und meldet ein fertiges DTO über `save`.
 */
@Component({
  selector: 'app-recording-form-dialog',
  standalone: true,
  imports: [FormsModule, DialogModule, DatePickerModule],
  templateUrl: './recording-form-dialog.html',
  styleUrl: './recording-form-dialog.css',
})
export class RecordingFormDialogComponent {
  /** Sichtbarkeit – two-way gebunden an die Elternkomponente. */
  readonly visible = model.required<boolean>();
  /** Zu bearbeitende Aufzeichnung, oder null zum Anlegen. */
  readonly recording = input<Recording | null>(null);
  /** Läuft ein Speichervorgang? Deaktiviert den Speichern-Button. */
  readonly saving = input<boolean>(false);

  readonly save    = output<CreateRecordingDto>();
  readonly invalid = output<void>();

  readonly editMode = computed(() => this.recording() !== null);

  title       = '';
  date:        Date | null = null;
  url         = '';
  passcode    = '';
  description = '';

  constructor() {
    // Beim Öffnen die Felder aus der (ggf. null) Vorlage befüllen.
    effect(() => {
      if (!this.visible()) return;
      const rec = this.recording();
      this.title       = rec?.title ?? '';
      this.date        = rec ? new Date(rec.recorded_on + 'T00:00:00') : new Date();
      this.url         = rec?.zoom_url ?? '';
      this.passcode    = rec?.passcode ?? '';
      this.description = rec?.description ?? '';
    });
  }

  onSave(): void {
    const title = this.title.trim();
    const url   = this.url.trim();

    if (!title || !url || !this.date) {
      this.invalid.emit();
      return;
    }

    this.save.emit({
      title,
      recorded_on: toIsoDate(this.date),
      zoom_url:    url,
      passcode:    this.passcode.trim() || null,
      description: this.description.trim() || null,
    });
  }

  close(): void {
    this.visible.set(false);
  }
}
