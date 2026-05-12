import { Routes } from '@angular/router';
import {KingSizePage} from './features/public/pages/king-size-page/king-size-page';
import {ContactPage} from './features/booking/pages/contact-page/contact-page';
import {adminGuard} from './core/admin.guard';
import {AdminLoginComponent} from './features/admin/components/admin-login-component/admin-login-component';
import {SidebarComponent} from './features/admin/pages/sidebar-component/sidebar-component';
import {AdminOverviewPage} from './features/admin/sections/admin-overview-page/admin-overview-page';
import {AdminAppointmentPage} from './features/admin/sections/admin-appointment-page/admin-appointment-page';
import {DataPrivacyPage} from './shared/pages/data-privacy-page/data-privacy-page';
import {ImpressumPage} from './shared/pages/impressum-page/impressum-page';
import {AgbPage} from './shared/pages/agb-page/agb-page';

export const routes: Routes = [
  { path: '', component: KingSizePage },
  { path: 'contact', component: ContactPage},
  { path: 'datenschutz', component: DataPrivacyPage},
  { path: 'impressum', component: ImpressumPage},
  { path: 'agb', component: AgbPage},
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/pages/sidebar-component/sidebar-component')
      .then(m => m.SidebarComponent),
    canActivate: [adminGuard],
    children: [
      { path: 'admin-overview', component: AdminOverviewPage, canActivate: [adminGuard] },
      { path: 'admin-appointments', component: AdminAppointmentPage, canActivate: [adminGuard] },
    ]
  },
];
