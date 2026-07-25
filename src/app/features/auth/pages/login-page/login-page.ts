import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { AuthCardComponent } from '../../components/auth-card/auth-card';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, Button, Password, InputTextModule, AuthCardComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  // Signals, weil die App zonenlos läuft: nach dem await gesetzte Werte
  // würden die View sonst nicht neu rendern.
  readonly error   = signal('');
  readonly loading = signal(false);

  /** Wer bereits eingeloggt ist, wird direkt weitergeleitet. */
  async ngOnInit() {
    if (await this.auth.loadSession()) {
      await this.router.navigate(['/dashboard']);
    }
  }

  async login() {
    this.error.set('');
    this.loading.set(true);

    const error = await this.auth.login(this.email.trim(), this.password);

    this.loading.set(false);

    if (error) {
      this.error.set(error);
      return;
    }

    // Admin wie User landen im selben Bereich – der Inhalt richtet sich nach der Rolle.
    await this.router.navigate(['/dashboard']);
  }

  goToForgotPassword() {
    this.router.navigate(['/passwort-vergessen']);
  }

  backToHome() {
    this.router.navigate(['/']);
  }
}
