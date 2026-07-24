import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../../core/supabase.client';

export type AppRole = 'admin' | 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  /** Aktuelle Supabase-Session – wird bei jedem Auth-Event aktualisiert. */
  readonly session = signal<Session | null>(null);

  readonly user = computed<User | null>(() => this.session()?.user ?? null);
  readonly isLoggedIn = computed(() => this.session() !== null);
  readonly role = computed<AppRole>(() => (this.isAdminUser(this.user()) ? 'admin' : 'user'));
  readonly isAdmin = computed(() => this.role() === 'admin');

  /** Anzeigename für die Sidebar (Fallback: E-Mail-Präfix). */
  readonly displayName = computed(() => {
    const user = this.user();
    if (!user) return 'Profil';
    const meta = user.user_metadata ?? {};
    return meta['full_name'] || meta['name'] || user.email?.split('@')[0] || 'Profil';
  });

  constructor() {
    supabase.auth.onAuthStateChange((_event, session) => this.session.set(session));
  }

  /** Lädt die persistierte Session – von den Guards vor jeder Navigation aufgerufen. */
  async loadSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    this.session.set(data.session);
    return data.session;
  }

  /** Gibt bei Erfolg null zurück, sonst die anzuzeigende Fehlermeldung. */
  async login(email: string, password: string): Promise<string | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return 'Falsche Zugangsdaten';
    }

    this.session.set(data.session);
    return null;
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout fehlgeschlagen:', error.message);
      return;
    }
    this.session.set(null);
    this.router.navigate(['/']);
  }

  /**
   * Admin ist ausschließlich, wer app_metadata.role === 'admin' trägt.
   *
   * Bewusst NICHT user_metadata: das kann der User über
   * supabase.auth.updateUser() selbst setzen. app_metadata lässt sich nur
   * serverseitig (Service-Role) ändern – und ist damit dieselbe Quelle,
   * die auch die RLS-Policies über public.is_admin() auswerten.
   */
  private isAdminUser(user: User | null): boolean {
    return user?.app_metadata?.['role'] === 'admin';
  }
}
