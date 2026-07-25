import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RecordingService } from '../../../../shared/services/recording-service/recording.service';
import { Recording } from '../../../../shared/models/recording.model';
import { RecordingTileComponent } from '../../components/recording-tile/recording-tile';

/** Mitgliederbereich: die Zoom-Aufzeichnungen der Mentoring-Calls. */
@Component({
  selector: 'app-recordings-page',
  standalone: true,
  imports: [RecordingTileComponent],
  templateUrl: './recordings-page.html',
  styleUrl: './recordings-page.css',
})
export class RecordingsPage implements OnInit {
  private recordingService = inject(RecordingService);

  readonly recordings = signal<Recording[]>([]);
  readonly loading     = signal(true);
  readonly failed      = signal(false);

  /** Freitextsuche über Titel und Beschreibung. */
  readonly query = signal('');

  /** Die nach der Suche sichtbaren Aufzeichnungen. */
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.recordings();
    return this.recordings().filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description?.toLowerCase().includes(q) ?? false),
    );
  });

  async ngOnInit() {
    try {
      this.recordings.set(await this.recordingService.getAll());
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
