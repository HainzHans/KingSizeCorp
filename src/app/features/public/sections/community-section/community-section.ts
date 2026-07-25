import { Component } from '@angular/core';
import {KingSizeButton} from '../../../../shared/components/king-size-button/king-size-button';

interface CommunityFeature {
  icon:  string;
  label: string;
}

interface CompareRow {
  tier:   string;
  price:  string;
  active: boolean;
}

@Component({
  selector: 'app-community-section',
  imports: [
    KingSizeButton
  ],
  templateUrl: './community-section.html',
  styleUrl: './community-section.css',
})
export class CommunitySection {
  readonly features: readonly CommunityFeature[] = [
    { icon: 'pi-chart-line', label: 'Tägliche Marktanalysen' },
    { icon: 'pi-megaphone',  label: 'Finanz‑ und Wirtschaftsnews' },
    { icon: 'pi-bitcoin',    label: 'Fundiertes Krypto‑Know‑how' },
  ];

  readonly perks: readonly string[] = [
    'Exklusive KingSize Community',
    'Tägliche Marktanalysen',
    'Finanz‑ und Wirtschaftsnews',
    'Fundiertes Krypto‑Know‑how',
  ];

  readonly compareRows: readonly CompareRow[] = [
    { tier: 'Community',    price: '€ 50 / Monat',      active: true },
    { tier: 'Live Trading', price: '€ 150 / Session',   active: false },
    { tier: 'Mentoring',    price: '€ 1600 / LifeTime', active: false },
  ];
}
