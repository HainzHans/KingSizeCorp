import {Component, input} from '@angular/core';
import {SmallDotComponent} from "../small-dot-component/small-dot-component";

@Component({
  selector: 'app-main-chip-component',
    imports: [
        SmallDotComponent
    ],
  templateUrl: './main-chip-component.html',
  styleUrl: './main-chip-component.css',
})
export class MainChipComponent {

  description = input<string>('');

}
