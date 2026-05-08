import { Component } from '@angular/core';

@Component({
  selector: 'app-statistic-section',
  imports: [],
  templateUrl: './statistic-section.html',
  styleUrl: './statistic-section.css',
})
export class StatisticSection {

  stats: Statistic[] = [
    {
      description: 'Zufriedene Kunden',
      value: '200+'
    },
    {
      description: 'Erfahrung',
      value: '6 Jahre'
    },
    {
      description: 'Ticks in der Woche',
      value: '1000+'
    },
    {
      description: 'Erreichbarkeit',
      value: '24/7'
    },
  ];

}

export interface Statistic {
  description: string;
  value: string;
}
