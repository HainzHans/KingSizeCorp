import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card-component';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'Mentoring');
    fixture.componentRef.setInput('description', 'Beschreibung');
    fixture.componentRef.setInput('price', '€ 1600');
    fixture.componentRef.setInput('priceUnit', '/ LifeTime');
    fixture.componentRef.setInput('features', ['Persönlicher Mentor']);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
