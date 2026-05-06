import { Component } from '@angular/core';
import {KingSizeButton} from '../../../components/buttons/king-size-button/king-size-button';
import {SmallDotComponent} from '../../../components/small-dot-component/small-dot-component';

@Component({
  selector: 'app-community-section',
  imports: [
    KingSizeButton,
    SmallDotComponent
  ],
  templateUrl: './community-section.html',
  styleUrl: './community-section.css',
})
export class CommunitySection {

}
