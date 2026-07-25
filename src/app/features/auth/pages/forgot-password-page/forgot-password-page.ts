import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { AuthCardComponent } from '../../components/auth-card/auth-card';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [FormsModule, Button, InputTextModule, AuthCardComponent],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.css',
})
export class ForgotPasswordPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';

  // Signals, weil die App zonenlos läuft: nach dem await gesetzte Werte
  // würden die View sonst nicht neu rendern.
  readonly loading = signal(false);
  readonly sent    = signal(false);

  async submit() {
    if (!this.email.trim()) return;
    this.loading.set(true);
    // Antwortet immer erfolgreich – ob die Adresse existiert, wird bewusst
    // nicht verraten. Der Nutzer sieht in jedem Fall dieselbe Bestätigung.
    await this.auth.requestPasswordReset(this.email.trim());
    this.loading.set(false);
    this.sent.set(true);
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
