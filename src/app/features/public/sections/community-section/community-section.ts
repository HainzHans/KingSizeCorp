import { Component } from '@angular/core';
import {KingSizeButton} from '../../../../shared/components/king-size-button/king-size-button';
import {SmallDotComponent} from '../../../../shared/components/small-dot-component/small-dot-component';

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
