import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KingSizeButton } from './king-size-button';

describe('KingSizeButton', () => {
  let component: KingSizeButton;
  let fixture: ComponentFixture<KingSizeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KingSizeButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KingSizeButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
