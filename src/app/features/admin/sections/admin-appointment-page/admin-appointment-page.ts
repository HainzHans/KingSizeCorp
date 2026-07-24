import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  Appointment,
  AppointmentType,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from '../../../../shared/models/appointment.model';
import { AppointmentService } from '../../../../shared/services/appointment-service/appointment.service';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';
import {
  BookedAppointmentService
} from '../../../../shared/services/booked-appointment-service/booked-appointment.service';
import {BookedAppointment} from '../../../../shared/models/booked-appointment.model';
import {toGermanDate, toIsoDate, toIsoTime} from '../../../../shared/utils/date.util';

@Component({
  selector: 'app-termine-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    DatePickerModule,
    ToastModule,
    ConfirmDialogModule,
    FormatDatePipe,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin-appointment-page.html',
  styleUrl: './admin-appointment-page.css',
})
export class AdminAppointmentPage implements OnInit {

  // ── Tabs ──────────────────────────────────────────────────
  activeTab = signal<'manage' | 'booked'>('manage');

  // ── Dialog state ─────────────────────────────────────────
  showDialog = signal(false);
  editMode   = signal(false);
  loading    = signal(false);

  dialogType:          AppointmentType = 'livetrading';
  dialogDate:          Date | null = null;
  dialogTime:          Date | null = null;
  dialogStripePriceId: string | null = null;
  editingId:           string | null = null;

  // ── Data ─────────────────────────────────────────────────
  // Signals, weil die App zonenlos läuft: ein einfaches Feld nach einem
  // await würde die View nicht neu rendern.
  readonly liveTradingAppointments = signal<Appointment[]>([]);
  readonly mentoringAppointments   = signal<Appointment[]>([]);
  readonly bookedAppointments      = signal<BookedAppointment[]>([]);

  private messageService           = inject(MessageService);
  private confirmationService      = inject(ConfirmationService);
  private appointmentService       = inject(AppointmentService);
  private bookedAppointmentService = inject(BookedAppointmentService);

  async ngOnInit() {
    await this.loadAppointments();
  }

  // ── Tab Switch ───────────────────────────────────────────
  setTab(tab: 'manage' | 'booked') {
    this.activeTab.set(tab);
    if (tab === 'booked' && this.bookedAppointments().length === 0) {
      this.loadBooked();
    }
  }

  // ── Load ─────────────────────────────────────────────────
  private async loadAppointments() {
    this.loading.set(true);
    try {
      // Das Aufräumen abgelaufener Termine läuft parallel zum Laden mit.
      const [, mentoring, livetrading] = await Promise.all([
        this.appointmentService.deleteExpired(),
        this.appointmentService.getAvailableByType('mentoring'),
        this.appointmentService.getAvailableByType('livetrading'),
      ]);
      this.mentoringAppointments.set(mentoring);
      this.liveTradingAppointments.set(livetrading);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary:  'Fehler',
        detail:   'Termine konnten nicht geladen werden.',
      });
    } finally {
      this.loading.set(false);
    }
  }

  private async loadBooked() {
    this.loading.set(true);
    try {
      this.bookedAppointments.set(await this.bookedAppointmentService.getUpcomingBooked());
    } catch {
      this.messageService.add({
        severity: 'error',
        summary:  'Fehler',
        detail:   'Gebuchte Termine konnten nicht geladen werden.',
      });
    } finally {
      this.loading.set(false);
    }
  }

  // ── Hilfsmethode: Typ-Label ──────────────────────────────
  typeLabel(type: string): string {
    return type === 'livetrading' ? 'LiveTrading' : 'Mentoring';
  }

  private getDefaultTime(): Date {
    const d = new Date();
    d.setHours(14, 0, 0, 0);
    return d;
  }

  // ── Open dialog ──────────────────────────────────────────
  openCreate(type: AppointmentType) {
    this.dialogType          = type;
    this.dialogDate          = null;
    this.dialogTime          = this.getDefaultTime();
    this.dialogStripePriceId = null;
    this.editingId           = null;
    this.editMode.set(false);
    this.showDialog.set(true);
  }

  openEdit(appt: Appointment) {
    this.dialogType          = appt.type;
    this.dialogDate          = new Date(appt.date + 'T00:00:00');
    this.dialogTime          = new Date(`1970-01-01T${appt.time}`);
    this.dialogStripePriceId = appt.stripe_price_id;
    this.editingId           = appt.id;
    this.editMode.set(true);
    this.showDialog.set(true);
  }

  closeDialog() {
    this.showDialog.set(false);
  }

  // ── Save ─────────────────────────────────────────────────
  async save() {
    if (!this.dialogDate || !this.dialogTime) {
      this.messageService.add({
        severity: 'warn',
        summary:  'Hinweis',
        detail:   'Bitte Datum und Uhrzeit angeben.',
      });
      return;
    }

    const dateStr = toIsoDate(this.dialogDate);
    const timeStr = toIsoTime(this.dialogTime);

    this.loading.set(true);

    try {
      if (this.editMode() && this.editingId) {
        const dto: UpdateAppointmentDto = {
          date:            dateStr,
          time:            timeStr,
          stripe_price_id: this.dialogStripePriceId,
        };
        const updated = await this.appointmentService.update(this.editingId, dto);
        this.replaceInList(updated);
        this.messageService.add({ severity: 'success', summary: 'Gespeichert', detail: 'Termin wurde aktualisiert.' });
      } else {
        const dto: CreateAppointmentDto = {
          type:            this.dialogType,
          date:            dateStr,
          time:            timeStr,
          stripe_price_id: this.dialogStripePriceId,
        };
        const created = await this.appointmentService.create(dto);
        this.addToList(created);
        this.messageService.add({ severity: 'success', summary: 'Erstellt', detail: `${this.typeLabel(this.dialogType)}-Termin angelegt.` });
      }
      this.closeDialog();
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Fehler', detail: 'Termin konnte nicht gespeichert werden.' });
    } finally {
      this.loading.set(false);
    }
  }

  // ── Delete ───────────────────────────────────────────────
  confirmDelete(appt: Appointment, event: Event) {
    this.confirmationService.confirm({
      target:  event.target as EventTarget,
      message: `${toGermanDate(appt.date)} um ${appt.time.slice(0, 5)} Uhr`,
      header:  'Termin löschen',
      icon:    'pi pi-trash',
      accept:  () => this.deleteAppointment(appt),
    });
  }

  private async deleteAppointment(appt: Appointment) {
    this.loading.set(true);
    try {
      await this.appointmentService.delete(appt.id);
      this.removeFromList(appt);
      this.messageService.add({ severity: 'info', summary: 'Gelöscht', detail: 'Termin wurde entfernt.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Fehler', detail: 'Termin konnte nicht gelöscht werden.' });
    } finally {
      this.loading.set(false);
    }
  }

  // ── List helpers ─────────────────────────────────────────
  /** Die Liste, in der ein Termin je nach Typ geführt wird. */
  private listFor(appt: Appointment): WritableSignal<Appointment[]> {
    return appt.type === 'livetrading'
      ? this.liveTradingAppointments
      : this.mentoringAppointments;
  }

  private addToList(appt: Appointment) {
    this.listFor(appt).update(list => [...list, appt]);
  }

  private replaceInList(appt: Appointment) {
    this.listFor(appt).update(list => list.map(a => a.id === appt.id ? appt : a));
  }

  private removeFromList(appt: Appointment) {
    this.listFor(appt).update(list => list.filter(a => a.id !== appt.id));
  }

  // ── Getter ───────────────────────────────────────────────
  get dialogTitle(): string {
    return this.editMode()
      ? `${this.typeLabel(this.dialogType)}-Termin bearbeiten`
      : `${this.typeLabel(this.dialogType)}-Termin erstellen`;
  }

  isAppointmentInFuture(appointment: Appointment) {
    return new Date(appointment.date) > new Date();
  }
}
