import { Component, input, output } from '@angular/core';
import { SidebarNavListComponent } from '../sidebar-nav-list/sidebar-nav-list';
import { NavItem } from '../../models/nav-item.model';

/** Ein-/ausklappbare Seitennavigation des Dashboards inkl. Footer. */
@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [SidebarNavListComponent],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.css',
})
export class DashboardSidebarComponent {
  readonly expanded    = input.required<boolean>();
  readonly navItems    = input.required<readonly NavItem[]>();
  readonly adminItems  = input.required<readonly NavItem[]>();
  readonly isAdmin     = input.required<boolean>();
  readonly activeKey   = input.required<string>();
  readonly displayName = input.required<string>();
  readonly roleLabel   = input.required<string>();

  readonly toggle   = output<void>();
  readonly navigate = output<NavItem>();
  readonly logout   = output<void>();
}
