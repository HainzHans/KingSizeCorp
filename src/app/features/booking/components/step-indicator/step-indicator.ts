import {Component, input} from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  imports: [],
  templateUrl: './step-indicator.html',
  styleUrl: './step-indicator.css',
})
export class StepIndicator {
  steps = input.required<string[]>();
  currentStep = input.required<number>();
}
