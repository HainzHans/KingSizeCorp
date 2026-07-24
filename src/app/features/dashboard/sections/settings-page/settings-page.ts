import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';

/**
 * Platzhalter für die Einstellungen.
 * Zeigt vorerst nur die Stammdaten der Session – Optionen folgen später.
 */
@Component({
  selector: 'app-settings-page',
  standalone: true,
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.css',
})
export class SettingsPage {
  private authService = inject(AuthService);

  readonly displayName = this.authService.displayName;
  readonly email       = computed(() => this.authService.user()?.email ?? '–');
  readonly roleLabel   = computed(() => (this.authService.isAdmin() ? 'Admin' : 'Mitglied'));
}
