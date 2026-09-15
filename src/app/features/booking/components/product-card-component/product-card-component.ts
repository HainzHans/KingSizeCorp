import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card-component.html',
  styleUrls: ['./product-card-component.css'],
})
export class ProductCardComponent {
  name        = input.required<string>();
  description = input.required<string>();
  price       = input.required<string>();
  priceUnit   = input.required<string>();
  features    = input.required<string[]>();
  icon        = input<string>('pi-box');
  badge       = input<string | null>(null);
  selected    = input<boolean>(false);

  select = output<void>();

  onSelect(): void {
    this.select.emit();
  }
}
