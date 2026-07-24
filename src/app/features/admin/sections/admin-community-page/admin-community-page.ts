import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CommunitySubscriptionService } from '../../../../shared/services/community-subscription-service/community-subscription.service';
import { CommunitySubscription } from '../../../../shared/models/community-subscription.model';
import { toGermanDate, toIsoDate } from '../../../../shared/utils/date.util';

type SubscriptionStatus = CommunitySubscription['status'];

@Component({
  selector: 'app-admin-community-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, TagModule, InputTextModule],
  templateUrl: './admin-community-page.html',
  styleUrl: './admin-community-page.css',
})
export class AdminCommunityPage implements OnInit {
  private communityService = inject(CommunitySubscriptionService);

  // Signals statt einfacher Felder: die App läuft zonenlos, ein normales
  // Feld nach einem await würde die View nicht neu rendern.
  readonly members     = signal<CommunitySubscription[]>([]);
  readonly searchQuery = signal('');

  readonly filtered = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.members();
    return this.members().filter(m =>
      m.customer_name.toLowerCase().includes(query) ||
      m.customer_email.toLowerCase().includes(query)
    );
  });

  readonly totalActive    = this.countByStatus('paid');
  readonly totalCancelled = this.countByStatus('cancelled');
  readonly totalPending   = this.countByStatus('pending');
  readonly totalExpired   = this.countByStatus('expired');

  async ngOnInit() {
    try {
      this.members.set(await this.communityService.getCommunitySubscriptions());
    } catch (e) {
      console.error('Fehler beim Laden:', e);
    }
  }

  getSeverity(status: SubscriptionStatus): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'paid':      return 'success';
      case 'pending':   return 'warn';
      case 'cancelled': return 'danger';
      default:          return 'secondary';
    }
  }

  getStatusLabel(status: SubscriptionStatus): string {
    switch (status) {
      case 'paid':      return 'Aktiv';
      case 'pending':   return 'Ausstehend';
      case 'cancelled': return 'Gekündigt';
      case 'expired':   return 'Abgelaufen';
      default:          return status;
    }
  }

  /** created_at ist ein Zeitstempel, kein reines Datum – daher der Umweg über Date. */
  formatDate(iso: string): string {
    return toGermanDate(toIsoDate(new Date(iso)));
  }

  private countByStatus(status: SubscriptionStatus) {
    return computed(() => this.members().filter(m => m.status === status).length);
  }
}
