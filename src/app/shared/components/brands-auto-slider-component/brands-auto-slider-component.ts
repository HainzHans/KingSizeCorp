import { Component } from '@angular/core';

@Component({
  selector: 'app-brands-auto-slider-component',
  imports: [],
  templateUrl: './brands-auto-slider-component.html',
  styleUrl: './brands-auto-slider-component.css',
})
export class BrandsAutoSliderComponent {

  brands = [
    { icon: 'bolt', name: 'Apex' },
    { icon: 'star', name: '4PropTrader' },
    { icon: 'globe', name: 'NextPropTrader' },
  ];


}
