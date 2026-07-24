import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepIndicator } from './step-indicator';

describe('StepIndicator', () => {
  let component: StepIndicator;
  let fixture: ComponentFixture<StepIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepIndicator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepIndicator);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('steps', ['Produkt', 'Kontakt']);
    fixture.componentRef.setInput('currentStep', 1);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
