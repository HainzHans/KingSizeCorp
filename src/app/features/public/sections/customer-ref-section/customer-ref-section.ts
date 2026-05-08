import {AfterViewInit, Component, ElementRef, HostListener} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-customer-ref-section',
  imports: [
    NgClass
  ],
  templateUrl: './customer-ref-section.html',
  styleUrl: './customer-ref-section.css',
})
export class CustomerRefSection implements AfterViewInit {

  topRow!: HTMLElement;
  bottomRow!: HTMLElement;
  container!: HTMLElement;

  maxTopShift = 0;
  maxBottomShift = 0;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.topRow = this.el.nativeElement.querySelector('.customer-ref-slider-top');
    this.bottomRow = this.el.nativeElement.querySelector('.customer-ref-slider-bottom');
    this.container = this.el.nativeElement.querySelector('.customer-ref-slider-container');

    this.calculateMaxShifts();
    this.applyAutoScrollDistances();
  }


  calculateMaxShifts() {

    // TOP ROW → letztes Element (7)
    const lastTopCard = this.topRow.children[0] as HTMLElement; // wegen row-reverse
    const lastTopCardWidth = lastTopCard.clientWidth;

    // Wie weit muss die Row nach rechts, damit 7 komplett sichtbar ist?
    this.maxTopShift = lastTopCardWidth;

    // BOTTOM ROW → letztes Element (1)
    const lastBottomCard = this.bottomRow.children[this.bottomRow.children.length - 1] as HTMLElement;
    const lastBottomCardWidth = lastBottomCard.clientWidth;

    // Wie weit muss die Row nach links, damit 1 komplett sichtbar ist?
    this.maxBottomShift = lastBottomCardWidth;
  }

  @HostListener('window:scroll')
  onScroll() {
    const rect = this.container.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {

      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const eased = Math.min(1, Math.max(0, progress));

      // TOP ROW → nach rechts
      const topShift = this.maxTopShift * eased;
      this.topRow.style.transform = `translateX(${topShift}px)`;

      // BOTTOM ROW → nach links
      const bottomShift = this.maxBottomShift * eased;
      this.bottomRow.style.transform = `translateX(-${bottomShift}px)`;
    }
  }

  applyAutoScrollDistances() {
    const styleSheet = document.styleSheets[0];

    // TOP → nach rechts
    const topRule = `
    @keyframes autoScrollRight {
      from { transform: translateX(0); }
      to   { transform: translateX(${this.maxTopShift}px); }
    }
  `;

    // BOTTOM → nach links
    const bottomRule = `
    @keyframes autoScrollLeft {
      from { transform: translateX(0); }
      to   { transform: translateX(-${this.maxBottomShift}px); }
    }
  `;

    styleSheet.insertRule(topRule, styleSheet.cssRules.length);
    styleSheet.insertRule(bottomRule, styleSheet.cssRules.length);
  }


  topCustomers: CustomerRef[] = [
    {
      name: 'Anonym',
      review: 5
    },
    {
      name: 'Christian',
      review: 5
    },
    {
      name: 'Ingmar',
      review: 5
    },
    {
      name: 'Anonym',
      review: 5
    },
    {
      name: 'Anonym',
      review: 5
    },
    {
      name: 'Anonym',
      review: 5
    },
    {
      name: 'Saskia',
      review: 5
    },
    {
      name: 'Anonym',
      review: 5
    },
    {
      name: 'Simon',
      review: 5
    },
    {
      name: 'Holger',
      review: 5
    },
    {
      name: 'Anonym',
      review: 5
    },
    {
      name: 'Anonym',
      review: 5
    },
    {
      name: 'Taha',
      review: 5
    },
    {
      name: 'Madjid',
      review: 5
    },
    {
      name: 'Anonym',
      review: 5
    },
    {
      name: 'M.',
      review: 5
    },
    {
      name: 'Johannes',
      review: 5
    },
    {
      name: 'S.',
      review: 5
    }
  ]

}

export interface CustomerRef {
  name: string;
  review: number
}
