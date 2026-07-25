import { Component, OnInit, inject, signal } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RecordingService } from '../../../../shared/services/recording-service/recording.service';
import { Recording, CreateRecordingDto } from '../../../../shared/models/recording.model';
import { AdminRecordingCardComponent } from '../../components/admin-recording-card/admin-recording-card';
import { RecordingFormDialogComponent } from '../../components/recording-form-dialog/recording-form-dialog';

@Component({
  selector: 'app-admin-recordings-page',
  standalone: true,
  imports: [
    ToastModule,
    ConfirmDialogModule,
    AdminRecordingCardComponent,
    RecordingFormDialogComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin-recordings-page.html',
  styleUrl: './admin-recordings-page.css',
})
export class AdminRecordingsPage implements OnInit {
  private recordingService    = inject(RecordingService);
  private messageService      = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // Signals, weil die App zonenlos läuft: ein normales Feld nach einem await
  // würde die View nicht neu rendern.
  readonly recordings = signal<Recording[]>([]);
  readonly loading    = signal(true);
  readonly saving     = signal(false);

  readonly showDialog        = signal(false);
  readonly editingRecording  = signal<Recording | null>(null);

  async ngOnInit() {
    await this.load();
  }

  private async load() {
    this.loading.set(true);
    try {
      this.recordings.set(await this.recordingService.getAll());
    } catch {
      this.showError('Aufzeichnungen konnten nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
  }

  openCreate() {
    this.editingRecording.set(null);
    this.showDialog.set(true);
  }

  openEdit(rec: Recording) {
    this.editingRecording.set(rec);
    this.showDialog.set(true);
  }

  onInvalid() {
    this.messageService.add({
      severity: 'warn',
      summary:  'Hinweis',
      detail:   'Bitte Titel, Datum und Zoom-Link angeben.',
    });
  }

  async save(payload: CreateRecordingDto) {
    const editing = this.editingRecording();

    this.saving.set(true);
    try {
      if (editing) {
        const updated = await this.recordingService.update(editing.id, payload);
        this.recordings.update(list => list.map(r => (r.id === updated.id ? updated : r)));
        this.messageService.add({ severity: 'success', summary: 'Gespeichert', detail: 'Aufzeichnung aktualisiert.' });
      } else {
        const created = await this.recordingService.create(payload);
        this.recordings.update(list => this.sortNewestFirst([created, ...list]));
        this.messageService.add({ severity: 'success', summary: 'Erstellt', detail: 'Aufzeichnung angelegt.' });
      }
      this.showDialog.set(false);
    } catch {
      this.showError('Aufzeichnung konnte nicht gespeichert werden.');
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(rec: Recording, event: Event) {
    this.confirmationService.confirm({
      target:  event.target as EventTarget,
      header:  'Aufzeichnung löschen',
      message: rec.title,
      accept:  () => this.deleteRecording(rec),
    });
  }

  private async deleteRecording(rec: Recording) {
    try {
      await this.recordingService.delete(rec.id);
      this.recordings.update(list => list.filter(r => r.id !== rec.id));
      this.messageService.add({ severity: 'info', summary: 'Gelöscht', detail: 'Aufzeichnung entfernt.' });
    } catch {
      this.showError('Aufzeichnung konnte nicht gelöscht werden.');
    }
  }

  private showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Fehler', detail });
  }

  private sortNewestFirst(list: Recording[]): Recording[] {
    return [...list].sort((a, b) => b.recorded_on.localeCompare(a.recorded_on));
  }
}
