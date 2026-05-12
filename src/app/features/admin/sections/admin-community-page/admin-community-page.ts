// src/app/pages/admin/admin-community-page/admin-community-page.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CommunitySubscriptionService } from '../../../../shared/services/community-subscription-service/community-subscription.service';
import {CommunitySubscription} from '../../../../shared/models/community-subscription.model';

@Component({
  selector: 'app-admin-community-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, TagModule, InputTextModule],
  templateUrl: './admin-community-page.html',
  styleUrl: './admin-community-page.css',
})
export class AdminCommunityPage implements OnInit {
  members: CommunitySubscription[] = [];
  loading = false;
  searchQuery = '';

  constructor(
    private communityService: CommunitySubscriptionService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.members = await this.communityService.getCommunitySubscriptions();
    } catch (e) {
      console.error('Fehler beim Laden:', e);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  get filtered(): CommunitySubscription[] {
    if (!this.searchQuery.trim()) return this.members;
    const q = this.searchQuery.toLowerCase();
    return this.members.filter(m =>
      m.customer_name.toLowerCase().includes(q) ||
      m.customer_email.toLowerCase().includes(q)
    );
  }

  get totalActive()    { return this.members.filter(m => m.status === 'paid').length; }
  get totalCancelled() { return this.members.filter(m => m.status === 'cancelled').length; }
  get totalPending()   { return this.members.filter(m => m.status === 'pending').length; }
  get totalExpired()   { return this.members.filter(m => m.status === 'expired').length; }

  getSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'paid':      return 'success';
      case 'pending':   return 'warn';
      case 'cancelled': return 'danger';
      default:          return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'paid':      return 'Aktiv';
      case 'pending':   return 'Ausstehend';
      case 'cancelled': return 'Gekündigt';
      case 'expired':   return 'Abgelaufen';
      default:          return status;
    }
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
  }
}
