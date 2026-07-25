import {Component, OnInit, inject, signal} from '@angular/core';
import {OrbitComponent} from '../../../../shared/components/orbit-component/orbit-component';
import {KingSizeButton} from '../../../../shared/components/king-size-button/king-size-button';
import {AppointmentService} from '../../../../shared/services/appointment-service/appointment.service';

interface IntroListItem {
  icon:  string;
  label: string;
}

@Component({
  selector: 'app-intro-section',
  imports: [
    OrbitComponent,
    KingSizeButton
  ],
  templateUrl: './intro-section.html',
  styleUrl: './intro-section.css',
})
export class IntroSection implements OnInit {
  private appointmentService = inject(AppointmentService);

  // Signals, weil die App zonenlos läuft: die Zähler werden erst nach einem
  // await gesetzt und würden die View sonst nicht neu rendern.
  readonly freeMentoringSlots   = signal(0);
  readonly freeLiveTradingSlots = signal(0);

  readonly deliverables: readonly IntroListItem[] = [
    { icon: 'pi-chart-line', label: 'NASDAQ Setup' },
    { icon: 'pi-shield',     label: 'Risk Management' },
    { icon: 'pi-file',       label: 'News richtig lesen' },
    { icon: 'pi-refresh',    label: 'Phasen des Wirtschaftszyklus' },
    { icon: 'pi-book',       label: 'Trading Workbook' },
  ];

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    const [mentoring, livetrading] = await Promise.all([
      this.appointmentService.getAvailableByType('mentoring'),
      this.appointmentService.getAvailableByType('livetrading'),
    ]);
    this.freeMentoringSlots.set(mentoring.length);
    this.freeLiveTradingSlots.set(livetrading.length);
  }
}
