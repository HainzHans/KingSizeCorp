import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-glow-button',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './glow-button-component.html',
  styleUrls: ['./glow-button-component.css'],
})
export class GlowButtonComponent {
  label      = input.required<string>();
  variant    = input<'primary' | 'ghost'>('primary');
  icon       = input<string | null>(null);
  iconPos    = input<'left' | 'right'>('left');
  disabled   = input<boolean>(false);
  routerLink = input<string | null>(null);

  onClick = output<MouseEvent>();
}
