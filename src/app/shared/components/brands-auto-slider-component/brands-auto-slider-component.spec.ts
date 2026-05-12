import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsAutoSliderComponent } from './brands-auto-slider-component';

describe('BrandsAutoSliderComponent', () => {
  let component: BrandsAutoSliderComponent;
  let fixture: ComponentFixture<BrandsAutoSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsAutoSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsAutoSliderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
