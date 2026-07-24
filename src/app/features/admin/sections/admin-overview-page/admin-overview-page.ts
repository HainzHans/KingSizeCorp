import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../../../shared/services/user-service/user.service';
import { User } from '../../../../shared/models/user.model';
import { UserPurchase } from '../../../../shared/models/user-purchase.model';

@Component({
  selector: 'app-admin-overview-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
  ],
  templateUrl: './admin-overview-page.html',
  styleUrl: './admin-overview-page.css',
})
export class AdminOverviewPage implements OnInit {
  private userService = inject(UserService);

  // Signals statt einfacher Felder: die App läuft zonenlos, ein normales
  // Feld nach einem await würde die View nicht neu rendern.
  readonly users       = signal<User[]>([]);
  readonly searchEmail = signal('');

  expandedRows: Record<string, boolean> = {};

  // ── Gefilterte User ──────────────────────────────────────
  readonly filteredUsers = computed(() => {
    const query = this.searchEmail().trim().toLowerCase();
    if (!query) return this.users();
    return this.users().filter(u =>
      u.email.toLowerCase().includes(query) ||
      u.name.toLowerCase().includes(query)
    );
  });

  // ── Stats ────────────────────────────────────────────────
  private readonly allPurchases = computed(() => this.users().flatMap(u => u.purchases));

  readonly totalUsers     = computed(() => this.users().length);
  readonly totalPurchases = computed(() => this.allPurchases().length);
  readonly totalRevenue   = computed(() => sumRevenue(this.allPurchases()));
  readonly pendingOrders  = computed(
    () => this.allPurchases().filter(p => p.status === 'Ausstehend').length
  );

  async ngOnInit() {
    try {
      this.users.set(await this.userService.getUsers());
    } catch (e) {
      console.error('Fehler beim Laden:', e);
    }
  }

  getUserRevenue(user: User): number {
    return sumRevenue(user.purchases);
  }

  // ── Expand / Collapse ────────────────────────────────────
  expandAll(): void {
    this.expandedRows = Object.fromEntries(
      this.filteredUsers().map(u => [u.email, true])
    );
  }

  collapseAll(): void {
    this.expandedRows = {};
  }

  // ── Severity Helper ──────────────────────────────────────
  getStatusSeverity(status: string): 'success' | 'warn' {
    return status === 'Abgeschlossen' ? 'success' : 'warn';
  }
}

/** Summiert nur abgeschlossene Käufe – ausstehende zählen nicht als Umsatz. */
function sumRevenue(purchases: UserPurchase[]): number {
  return purchases
    .filter(p => p.status === 'Abgeschlossen')
    .reduce((sum, p) => sum + p.price, 0);
}
