import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { KingSizeLogoComponent } from '../../../../shared/components/king-size-logo-component/king-size-logo-component';

/** Obere Leiste des Dashboards mit Logo und Konto-Menü. */
@Component({
  selector: 'app-dashboard-toolbar',
  standalone: true,
  imports: [KingSizeLogoComponent],
  templateUrl: './dashboard-toolbar.html',
  styleUrl: './dashboard-toolbar.css',
})
export class DashboardToolbarComponent {
  private hostRef = inject(ElementRef<HTMLElement>);

  readonly displayName = input.required<string>();
  readonly roleLabel   = input.required<string>();

  readonly openSettings = output<void>();
  readonly logout       = output<void>();

  /** Steuert das Dropdown hinter dem User-Icon. */
  readonly isUserMenuOpen = signal(false);

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(v => !v);
  }

  onSettings(): void {
    this.isUserMenuOpen.set(false);
    this.openSettings.emit();
  }

  onLogout(): void {
    this.isUserMenuOpen.set(false);
    this.logout.emit();
  }

  /** Klick außerhalb des Menüs schließt es wieder. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isUserMenuOpen()) return;

    const target = event.target as Node | null;
    const menuRoot = this.hostRef.nativeElement.querySelector('.toolbar-user');
    if (target && menuRoot?.contains(target)) return;

    this.isUserMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isUserMenuOpen.set(false);
  }
}
