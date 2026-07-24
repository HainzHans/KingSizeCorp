import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { KingSizeLogoComponent } from '../../../../shared/components/king-size-logo-component/king-size-logo-component';
import { AdminOverviewPage } from '../../../admin/sections/admin-overview-page/admin-overview-page';
import { AdminAppointmentPage } from '../../../admin/sections/admin-appointment-page/admin-appointment-page';
import { AdminCommunityPage } from '../../../admin/sections/admin-community-page/admin-community-page';
import { UserOverviewPage } from '../../sections/user-overview-page/user-overview-page';
import { SettingsPage } from '../../sections/settings-page/settings-page';

export interface NavItem {
  icon:  string;
  label: string;
  key:   string;
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    KingSizeLogoComponent,
    AdminOverviewPage,
    AdminAppointmentPage,
    AdminCommunityPage,
    UserOverviewPage,
    SettingsPage,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private authService = inject(AuthService);
  private hostRef = inject(ElementRef<HTMLElement>);

  isExpanded = signal(true);

  /** Steuert das Dropdown hinter dem User-Icon in der Toolbar. */
  isUserMenuOpen = signal(false);

  readonly isAdmin     = this.authService.isAdmin;
  readonly displayName = this.authService.displayName;
  readonly roleLabel   = computed(() => (this.isAdmin() ? 'Admin' : 'Mitglied'));

  /** Für jede Rolle sichtbar. */
  readonly navItems: readonly NavItem[] = [
    { icon: 'pi-home', label: 'Übersicht', key: 'user-overview' },
  ];

  /** Nur für Admins sichtbar. */
  readonly adminItems: readonly NavItem[] = [
    { icon: 'pi-users',    label: 'Übersicht', key: 'admin-overview'     },
    { icon: 'pi-star',     label: 'Community', key: 'admin-community'    },
    { icon: 'pi-calendar', label: 'Termine',   key: 'admin-appointments' },
  ];

  activeKey = signal<string>(this.authService.isAdmin() ? 'admin-overview' : 'user-overview');

  toggle(): void {
    this.isExpanded.update(v => !v);
  }

  setActive(item: NavItem): void {
    this.activeKey.set(item.key);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(v => !v);
  }

  openSettings(): void {
    this.isUserMenuOpen.set(false);
    this.activeKey.set('settings');
  }

  logout(): void {
    this.isUserMenuOpen.set(false);
    this.authService.logout();
  }

  /** Klick außerhalb der Toolbar schließt das Menü wieder. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isUserMenuOpen()) return;

    const target = event.target as Node | null;
    const menuRoot = (this.hostRef.nativeElement as HTMLElement).querySelector('.toolbar-user');
    if (target && menuRoot?.contains(target)) return;

    this.isUserMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isUserMenuOpen.set(false);
  }
}
