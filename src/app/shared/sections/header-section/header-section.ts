import { Component } from '@angular/core';
import {KingSizeButton} from "../../components/king-size-button/king-size-button";
import {KingSizeLogoComponent} from '../../components/king-size-logo-component/king-size-logo-component';

@Component({
  selector: 'app-header-section',
  imports: [
    KingSizeButton,
    KingSizeLogoComponent,
  ],
  templateUrl: './header-section.html',
  styleUrl: './header-section.css',
})
export class HeaderSection {

}
