import {Component, OnInit} from '@angular/core';
import {OrbitComponent} from '../../../../shared/components/orbit-component/orbit-component';
import {KingSizeButton} from '../../../../shared/components/king-size-button/king-size-button';
import {AppointmentService} from '../../../../shared/services/appointment-service/appointment.service';

@Component({
  selector: 'app-intro-section',
  imports: [
    OrbitComponent,
    KingSizeButton
  ],
  templateUrl: './intro-section.html',
  styleUrl: './intro-section.css',
})
export class IntroSection implements OnInit{

  freeMentoringSlots: number = 0;
  freeLiveTradingSlots: number = 0;

  constructor(private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.appointmentService.getAvailableByType('mentoring').then((appointments) => {
      this.freeMentoringSlots = appointments.length
    })

    this.appointmentService.getAvailableByType('livetrading').then((appointments) => {
      this.freeLiveTradingSlots = appointments.length
    })
  }
}
