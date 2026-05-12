import {Component, input} from '@angular/core';
import {NavigationService} from '../../services/navigation-service/navigation-service';

@Component({
  selector: 'app-king-size-logo-component',
  imports: [],
  templateUrl: './king-size-logo-component.html',
  styleUrl: './king-size-logo-component.css',
})
export class KingSizeLogoComponent {

  isSmall = input<boolean>(false);

  constructor(private navigationService: NavigationService) {
  }

  navigateHome() {
    this.navigationService.navigateTo('');
  }

}
