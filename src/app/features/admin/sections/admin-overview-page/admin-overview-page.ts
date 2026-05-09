import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import {UserService} from '../../../../shared/services/user-service/user.service';
import {User} from '../../../../shared/models/user.model';


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

  expandedRows: any = {};
  searchEmail       = '';
  users: User[]  = [];
  loading           = false;

  constructor(private adminOverviewService: UserService,
              private cdr: ChangeDetectorRef,) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.users = await this.adminOverviewService.getUsers();
    } catch (e) {
      console.error('Fehler beim Laden:', e);
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // ← Angular explizit informieren
    }
  }

  // ── Gefilterte User ──────────────────────────────────────
  get filteredUsers(): User[] {
    if (!this.searchEmail.trim()) return this.users;
    const q = this.searchEmail.toLowerCase();
    return this.users.filter(u =>
      u.email.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q)
    );
  }

  // ── Stats ────────────────────────────────────────────────
  get totalUsers()     { return this.users.length; }
  get totalRevenue()   { return this.users.flatMap(u => u.purchases).filter(p => p.status === 'Abgeschlossen').reduce((s, p) => s + p.price, 0); }
  get pendingOrders()  { return this.users.flatMap(u => u.purchases).filter(p => p.status === 'Ausstehend').length; }
  get totalPurchases() { return this.users.flatMap(u => u.purchases).length; }

  getUserRevenue(user: User): number {
    return user.purchases
      .filter((p) => p.status === 'Abgeschlossen')
      .reduce((s, p) => s + p.price, 0);
  }

  // ── Expand / Collapse ────────────────────────────────────
  expandAll() {
    this.expandedRows = this.filteredUsers.reduce((acc: any, u) => {
      acc[u.email] = true;
      return acc;
    }, {});
  }

  collapseAll() {
    this.expandedRows = {};
  }

  onRowExpand(event: TableRowExpandEvent)    {}
  onRowCollapse(event: TableRowCollapseEvent) {}

  // ── Severity Helpers ─────────────────────────────────────
  getUserSeverity(status: string): 'success' | 'warn' {
    return status === 'Abgeschlossen' ? 'success' : 'warn';
  }

  getPurchaseSeverity(status: string): 'success' | 'warn' {
    return status === 'Abgeschlossen' ? 'success' : 'warn';
  }
}
