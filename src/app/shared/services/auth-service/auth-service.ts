import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {supabase} from '../../../core/supabase.client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout fehlgeschlagen:', error.message);
      return;
    }
    this.router.navigate(['/']);
  }
}
