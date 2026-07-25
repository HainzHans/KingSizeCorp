import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { DashboardToolbarComponent } from '../../components/dashboard-toolbar/dashboard-toolbar';
import { DashboardSidebarComponent } from '../../components/dashboard-sidebar/dashboard-sidebar';
import { NavItem } from '../../models/nav-item.model';
import { AdminOverviewPage } from '../../../admin/sections/admin-overview-page/admin-overview-page';
import { AdminAppointmentPage } from '../../../admin/sections/admin-appointment-page/admin-appointment-page';
import { AdminCommunityPage } from '../../../admin/sections/admin-community-page/admin-community-page';
import { AdminRecordingsPage } from '../../../admin/sections/admin-recordings-page/admin-recordings-page';
import { UserOverviewPage } from '../../sections/user-overview-page/user-overview-page';
import { RecordingsPage } from '../../sections/recordings-page/recordings-page';
import { SettingsPage } from '../../sections/settings-page/settings-page';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    DashboardToolbarComponent,
    DashboardSidebarComponent,
    AdminOverviewPage,
    AdminAppointmentPage,
    AdminCommunityPage,
    AdminRecordingsPage,
    UserOverviewPage,
    RecordingsPage,
    SettingsPage,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private authService = inject(AuthService);

  readonly isExpanded = signal(true);

  readonly isAdmin     = this.authService.isAdmin;
  readonly displayName = this.authService.displayName;
  readonly roleLabel   = computed(() => (this.isAdmin() ? 'Admin' : 'Mitglied'));

  /** Für jede Rolle sichtbar. */
  readonly navItems: readonly NavItem[] = [
    { icon: 'pi-home',  label: 'Übersicht',      key: 'user-overview' },
    { icon: 'pi-video', label: 'Aufzeichnungen', key: 'recordings'    },
  ];

  /** Nur für Admins sichtbar. */
  readonly adminItems: readonly NavItem[] = [
    { icon: 'pi-users',    label: 'Übersicht',      key: 'admin-overview'     },
    { icon: 'pi-star',     label: 'Community',      key: 'admin-community'    },
    { icon: 'pi-calendar', label: 'Termine',        key: 'admin-appointments' },
    { icon: 'pi-video',    label: 'Aufzeichnungen', key: 'admin-recordings'   },
  ];

  readonly activeKey = signal<string>(this.authService.isAdmin() ? 'admin-overview' : 'user-overview');

  toggle(): void {
    this.isExpanded.update(v => !v);
  }

  setActive(item: NavItem): void {
    this.activeKey.set(item.key);
  }

  openSettings(): void {
    this.activeKey.set('settings');
  }

  logout(): void {
    this.authService.logout();
  }
}
