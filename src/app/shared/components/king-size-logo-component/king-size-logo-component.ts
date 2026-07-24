import {Component, inject, input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-king-size-logo-component',
  imports: [],
  templateUrl: './king-size-logo-component.html',
  styleUrl: './king-size-logo-component.css',
})
export class KingSizeLogoComponent {

  private router = inject(Router);

  isSmall = input<boolean>(false);

  navigateHome() {
    this.router.navigate(['']);
  }

}
