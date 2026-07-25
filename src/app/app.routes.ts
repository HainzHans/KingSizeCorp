import { Routes } from '@angular/router';
import {KingSizePage} from './features/public/pages/king-size-page/king-size-page';
import {ContactPage} from './features/booking/pages/contact-page/contact-page';
import {authGuard} from './core/auth.guard';
import {LoginPage} from './features/auth/pages/login-page/login-page';
import {DataPrivacyPage} from './features/public/pages/data-privacy-page/data-privacy-page';
import {ImpressumPage} from './features/public/pages/impressum-page/impressum-page';
import {AgbPage} from './features/public/pages/agb-page/agb-page';

export const routes: Routes = [
  { path: '', component: KingSizePage },
  { path: 'contact', component: ContactPage},
  { path: 'datenschutz', component: DataPrivacyPage},
  { path: 'impressum', component: ImpressumPage},
  { path: 'agb', component: AgbPage},
  { path: 'login', component: LoginPage },
  { path: 'admin-login', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'passwort-vergessen',
    loadComponent: () => import('./features/auth/pages/forgot-password-page/forgot-password-page')
      .then(m => m.ForgotPasswordPage),
  },
  {
    // Ziel des Recovery-Links aus der Mail. Muss in den Supabase-Auth-
    // Einstellungen (Redirect URLs) freigegeben sein.
    path: 'passwort-setzen',
    loadComponent: () => import('./features/auth/pages/set-password-page/set-password-page')
      .then(m => m.SetPasswordPage),
  },
  {
    // Ein Bereich für alle eingeloggten Mitglieder. Ob der Admin-Block
    // erscheint, entscheidet die Sidebar anhand der Rolle – abgesichert
    // wird das serverseitig über die RLS-Policies (public.is_admin()).
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page')
      .then(m => m.DashboardPage),
    canActivate: [authGuard],
  },
  { path: 'admin', redirectTo: 'dashboard', pathMatch: 'full' },
];
