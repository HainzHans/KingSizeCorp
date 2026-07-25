import { Component, input, output } from '@angular/core';
import { NavItem } from '../../models/nav-item.model';

/**
 * Eine Gruppe von Navigationseinträgen in der Dashboard-Sidebar. Wird sowohl
 * für die Haupt- als auch die Admin-Navigation verwendet – das Markup war
 * zuvor in der dashboard-page dupliziert.
 *
 * `expanded` steuert (statt eines Elternselektors) das Ein-/Ausblenden der
 * Labels, damit die Styles innerhalb der Komponentengrenze bleiben.
 */
@Component({
  selector: 'app-sidebar-nav-list',
  standalone: true,
  templateUrl: './sidebar-nav-list.html',
  styleUrl: './sidebar-nav-list.css',
  host: {
    '[class.expanded]': 'expanded()',
    '[class.is-admin]': "variant() === 'admin'",
  },
})
export class SidebarNavListComponent {
  readonly items     = input.required<readonly NavItem[]>();
  readonly activeKey = input.required<string>();
  readonly expanded  = input.required<boolean>();
  readonly variant   = input<'main' | 'admin'>('main');

  readonly select = output<NavItem>();
}
