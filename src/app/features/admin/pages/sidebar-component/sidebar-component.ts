import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { KingSizeLogoComponent } from '../../../../shared/components/king-size-logo-component/king-size-logo-component';
import { AdminOverviewPage } from '../../sections/admin-overview-page/admin-overview-page';
import { AdminAppointmentPage } from '../../sections/admin-appointment-page/admin-appointment-page';
import {AdminCommunityPage} from '../../sections/admin-community-page/admin-community-page';

export interface NavItem {
  icon:      string;
  label:     string;
  key:       string;
  active?:   boolean;
}

@Component({
  selector: 'app-sidebar-component',
  standalone: true,
  imports: [
    CommonModule,
    KingSizeLogoComponent,
    AdminOverviewPage,
    AdminAppointmentPage,
    AdminCommunityPage,
  ],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  private authService = inject(AuthService);

  isExpanded  = signal(true);
  activeKey   = signal<string>('admin-overview');

  navItems: NavItem[] = [];

  adminItems: NavItem[] = [
    { icon: 'pi-users',    label: 'Übersicht', key: 'admin-overview'     },
    { icon: 'pi-star',        label: 'Community',  key: 'admin-community'    },
    { icon: 'pi-calendar', label: 'Termine',   key: 'admin-appointments' },
  ];

  toggle() {
    this.isExpanded.update(v => !v);
  }

  setActive(item: NavItem) {
    [...this.navItems, ...this.adminItems].forEach(i => (i.active = false));
    item.active = true;
    this.activeKey.set(item.key);
  }

  logout() {
    this.authService.logout();
  }
}
