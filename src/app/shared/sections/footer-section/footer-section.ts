import { Component } from '@angular/core';
import {KingSizeButton} from '../../components/king-size-button/king-size-button';
import {KingSizeLogoComponent} from '../../components/king-size-logo-component/king-size-logo-component';
import {SmallDotComponent} from '../../components/small-dot-component/small-dot-component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-footer-section',
  imports: [
    KingSizeButton,
    KingSizeLogoComponent,
    SmallDotComponent
  ],
  templateUrl: './footer-section.html',
  styleUrl: './footer-section.css',
})
export class FooterSection {

  constructor(private router: Router) {
  }

  async navigateTo(target: string) {
    await this.router.navigate([target])
  }

}
