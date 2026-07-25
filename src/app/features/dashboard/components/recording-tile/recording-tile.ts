import { Component, computed, input, signal } from '@angular/core';
import { Recording } from '../../../../shared/models/recording.model';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';

/**
 * Eine Aufzeichnungs-Kachel in der Mitglieder-Videothek: Poster mit
 * stabilem Farbton, Titel/Datum und – falls vorhanden – dem kopierbaren
 * Passwort. Kapselt die eigene UI-Logik (Öffnen, Kopieren).
 */
@Component({
  selector: 'app-recording-tile',
  standalone: true,
  imports: [FormatDatePipe],
  templateUrl: './recording-tile.html',
  styleUrl: './recording-tile.css',
  host: {
    '[style.--tile-hue]': 'hue()',
  },
})
export class RecordingTileComponent {
  readonly recording = input.required<Recording>();
  readonly isNewest  = input<boolean>(false);

  /** true, solange das Kopier-Feedback angezeigt wird. */
  readonly copied = signal(false);

  /**
   * Ein stabiler, dezenter Farbton pro Aufzeichnung. Bewusst auf einen engen
   * Grün-/Teal-Bereich (150–194°) rund um die Brand-Farbe begrenzt, damit die
   * Poster ruhig und einheitlich wirken statt bunt – aber trotzdem jede Kachel
   * ihren eigenen, wiedererkennbaren Ton behält.
   */
  readonly hue = computed(() => {
    const rec = this.recording();
    const src = rec.id || rec.title;
    let hash = 0;
    for (let i = 0; i < src.length; i++) {
      hash = (hash * 31 + src.charCodeAt(i)) % 360;
    }
    return 150 + (hash % 45);
  });

  open(): void {
    window.open(this.recording().zoom_url, '_blank', 'noopener');
  }

  async copyPasscode(): Promise<void> {
    const passcode = this.recording().passcode;
    if (!passcode) return;
    try {
      await navigator.clipboard.writeText(passcode);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      // Clipboard nicht verfügbar – das Passwort steht ohnehin sichtbar da.
    }
  }
}
