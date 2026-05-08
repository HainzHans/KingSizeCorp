import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import {supabase} from '../../../../core/supabase.client';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, Button, InputText, Password],
  templateUrl: './admin-login-component.html',
  styleUrl: './admin-login-component.css'
})
export class AdminLoginComponent {
  email = 'admin@kingsize.de'; // optional vorausgefüllt
  password = '';
  error = '';
  loading = false;

  constructor(private router: Router) {}

  async login() {
    this.error = '';
    this.loading = true;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password
    });

    this.loading = false;

    if (error) {
      this.error = 'Falsche Zugangsdaten';
      return;
    }

    await this.router.navigate(['/admin']);
  }
}
