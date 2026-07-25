import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { AuthCardComponent } from '../../components/auth-card/auth-card';

@Component({
  selector: 'app-set-password-page',
  standalone: true,
  imports: [FormsModule, Button, Password, AuthCardComponent],
  templateUrl: './set-password-page.html',
  styleUrl: './set-password-page.css',
})
export class SetPasswordPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  password = '';
  confirm = '';

  // Signals, weil die App zonenlos läuft: nach dem await gesetzte Werte
  // würden die View sonst nicht neu rendern.
  readonly error   = signal('');
  readonly loading = signal(false);

  /** Recovery-Session vorhanden – erst dann darf das Formular erscheinen. */
  readonly ready = signal(false);
  /** Prüfung abgeschlossen – vorher zeigen wir weder Formular noch Fehler. */
  readonly checked = signal(false);

  async ngOnInit() {
    // supabase-js verarbeitet den Link-Hash während der Client-Initialisierung;
    // getSession() (in loadSession) wartet darauf und liefert die
    // Recovery-Session zuverlässig. Ein zusätzlicher Auth-Listener ist damit
    // nicht nötig – und ein Signal-Write im Konstruktor-Effect würde nur eine
    // NG0100-Warnung während der Change Detection auslösen.
    const session = await this.auth.loadSession();
    this.ready.set(!!session);
    this.checked.set(true);
  }

  async submit() {
    this.error.set('');

    if (this.password.length < 8) {
      this.error.set('Das Passwort muss mindestens 8 Zeichen haben.');
      return;
    }
    if (this.password !== this.confirm) {
      this.error.set('Die Passwörter stimmen nicht überein.');
      return;
    }

    this.loading.set(true);
    const error = await this.auth.updatePassword(this.password);
    this.loading.set(false);

    if (error) {
      this.error.set(error);
      return;
    }

    // Nach dem Setzen ist der User eingeloggt – direkt in den Bereich.
    await this.router.navigate(['/dashboard']);
  }

  goToReset() {
    this.router.navigate(['/passwort-vergessen']);
  }
}
