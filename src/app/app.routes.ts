import { Routes } from '@angular/router';
import {KingSizePage} from './pages/king-size-page/king-size-page';
import {ContactPage} from './pages/contact-page/contact-page';
import {adminGuard} from './core/admin.guard';
import {AdminLoginComponent} from './components/admin-login-component/admin-login-component';
import {SidebarComponent} from './components/sidebar-component/sidebar-component';
import {AdminOverviewPage} from './pages/admin/admin-overview-page/admin-overview-page';
import {AdminAppointmentPage} from './pages/admin/admin-appointment-page/admin-appointment-page';
import {DataPrivacyPage} from './pages/data-privacy-page/data-privacy-page';
import {ImpressumPage} from './pages/impressum-page/impressum-page';
import {AgbPage} from './pages/agb-page/agb-page';

export const routes: Routes = [
  { path: '', component: KingSizePage },
  { path: 'contact', component: ContactPage},
  { path: 'datenschutz', component: DataPrivacyPage},
  { path: 'impressum', component: ImpressumPage},
  { path: 'agb', component: AgbPage},
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'admin',
    loadComponent: () => import('./components/sidebar-component/sidebar-component')
      .then(m => m.SidebarComponent),
    canActivate: [adminGuard],
    children: [
      { path: 'admin-overview', component: AdminOverviewPage, canActivate: [adminGuard] },
      { path: 'admin-appointments', component: AdminAppointmentPage, canActivate: [adminGuard] },
    ]
  },
];
