import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KingSizeLogoComponent } from './king-size-logo-component';

describe('KingSizeLogoComponent', () => {
  let component: KingSizeLogoComponent;
  let fixture: ComponentFixture<KingSizeLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KingSizeLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KingSizeLogoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
