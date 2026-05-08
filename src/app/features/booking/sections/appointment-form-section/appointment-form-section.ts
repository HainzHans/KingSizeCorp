import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, RouterModule} from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

// Components
import { ProductCardComponent } from '../../components/product-card-component/product-card-component';
import { AppointmentSlotCardComponent } from '../../components/appointment-slot-card-component/appointment-slot-card-component';
import { BookingSummaryComponent } from '../../components/booking-summary-component/booking-summary-component';
import { GlowButtonComponent } from '../../../../shared/components/glow-button-component/glow-button-component';

// Models & Services
import { Appointment, AppointmentType } from '../../../../shared/models/appointment.model';
import { AppointmentService } from '../../services/appointment-service/appointment.service';
import { BookingService } from '../../services/booking-service/booking.service';

@Component({
  selector: 'app-appointment-form-section',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    ProductCardComponent,
    AppointmentSlotCardComponent,
    BookingSummaryComponent,
    GlowButtonComponent,
  ],
  templateUrl: './appointment-form-section.html',
  styleUrls: ['./appointment-form-section.css'],
})
export class AppointmentFormSection implements OnInit {

  /* ── State ──────────────────────────────────────────────── */
  currentStep     = signal<number>(1);
  selectedProduct = signal<AppointmentType | null>(null);
  selectedSlot    = signal<Appointment | undefined>(undefined);
  availableSlots  = signal<Appointment[]>([]);
  loadingSlots    = signal<boolean>(false);
  bookingStatus   = signal<'success' | 'cancel' | null>(null);
  submitting      = signal(false);

  // Ob Community gewählt wurde (überspringt Schritt 3 – Terminwahl)
  isCommunity     = signal<boolean>(false);

  steps = ['Produkt', 'Kontakt', 'Termin', 'Übersicht'];

  contactForm!: FormGroup;

  constructor(
    private fb:                 FormBuilder,
    private appointmentService: AppointmentService,
    private bookingService:     BookingService,
    private route:              ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone:    ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,20}$/)]],
      email:    ['', [Validators.required, Validators.email]],
    });

    const status = this.route.snapshot.queryParamMap.get('status');
    if (status === 'success') {
      this.bookingStatus.set('success');
      this.currentStep.set(5);
    } else if (status === 'cancel') {
      this.bookingStatus.set('cancel');
      this.currentStep.set(5);
    }
  }

  /* ── Navigation ─────────────────────────────────────────── */
  nextStep(): void {
    if (this.currentStep() < 5) {
      // Community überspringt Schritt 3 (Terminwahl) → direkt zur Übersicht
      if (this.currentStep() === 2 && this.isCommunity()) {
        this.currentStep.set(4);
        return;
      }

      this.currentStep.update(s => s + 1);

      if (this.currentStep() === 3 && this.selectedProduct()) {
        this.loadSlots(this.selectedProduct()!);
      }
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      // Community: von Schritt 4 zurück zu Schritt 2 (nicht 3)
      if (this.currentStep() === 4 && this.isCommunity()) {
        this.currentStep.set(2);
        return;
      }
      this.currentStep.update(s => s - 1);
    }
  }

  /* ── Selections ─────────────────────────────────────────── */
  selectProduct(product: AppointmentType): void {
    if (this.selectedProduct() !== product) {
      this.selectedSlot.set(undefined);
      this.availableSlots.set([]);
    }
    this.selectedProduct.set(product);
    this.isCommunity.set(product === 'community');
  }

  selectSlot(slot: Appointment): void {
    this.selectedSlot.set(slot);
  }

  /* ── Load slots ─────────────────────────────────────────── */
  protected async loadSlots(type: AppointmentType): Promise<void> {
    if (type === 'community') return;

    this.loadingSlots.set(true);
    this.selectedSlot.set(undefined);
    try {
      const slots = await this.appointmentService.getAvailableByType(type);
      this.availableSlots.set(slots);
    } catch {
      this.availableSlots.set([]);
    } finally {
      this.loadingSlots.set(false);
    }
  }

  /* ── Submit ─────────────────────────────────────────────── */
  async submitBooking(): Promise<void> {
    if (this.contactForm.invalid || !this.selectedProduct()) return;

    // Community braucht keinen Slot
    if (!this.isCommunity() && !this.selectedSlot()) return;

    this.submitting.set(true);

    try {
      let url: string;

      if (this.isCommunity()) {
        url = await this.bookingService.createCommunityCheckout({
          customer_name:  this.contactForm.value.fullName,
          customer_email: this.contactForm.value.email,
          customer_phone: this.contactForm.value.phone,
        });
      } else {
        url = await this.bookingService.createCheckout({
          appointment_id: this.selectedSlot()!.id,
          customer_name:  this.contactForm.value.fullName,
          customer_email: this.contactForm.value.email,
          customer_phone: this.contactForm.value.phone,
        });
      }

      window.location.href = url;

    } catch (err: any) {
      this.submitting.set(false);
      if (err?.status === 409) {
        alert('Dieser Termin wurde leider gerade von jemand anderem gebucht. Bitte wähle einen anderen Termin.');
        this.currentStep.set(3);
        this.selectedSlot.set(undefined);
        await this.loadSlots(this.selectedProduct()!);
      } else {
        alert('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.');
      }
    }
  }

  isSlotInFuture(date: string) {
    return new Date(date) > new Date();
  }

  /* ── Computed Helpers ───────────────────────────────────── */
  get stepLabels(): string[] {
    return this.isCommunity()
      ? ['Produkt', 'Kontakt', 'Übersicht']
      : ['Produkt', 'Kontakt', 'Termin', 'Übersicht'];
  }

  // Schritt-Nummer für Anzeige (Community zeigt 1,2,3 statt 1,2,4)
  get displayStep(): number {
    if (!this.isCommunity()) return this.currentStep();
    if (this.currentStep() <= 2) return this.currentStep();
    return 3; // Schritt 4 wird als "3" angezeigt bei Community
  }
}
