import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, Button, Password, InputTextModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  loading = false;

  /** Wer bereits eingeloggt ist, wird direkt weitergeleitet. */
  async ngOnInit() {
    if (await this.auth.loadSession()) {
      await this.router.navigate(['/dashboard']);
    }
  }

  async login() {
    this.error = '';
    this.loading = true;

    const error = await this.auth.login(this.email.trim(), this.password);

    this.loading = false;

    if (error) {
      this.error = error;
      return;
    }

    // Admin wie User landen im selben Bereich – der Inhalt richtet sich nach der Rolle.
    await this.router.navigate(['/dashboard']);
  }

  backToHome() {
    this.router.navigate(['/']);
  }
}
