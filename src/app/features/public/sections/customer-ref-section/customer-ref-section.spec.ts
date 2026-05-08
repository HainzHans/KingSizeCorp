import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRefSection } from './customer-ref-section';

describe('CustomerRefSection', () => {
  let component: CustomerRefSection;
  let fixture: ComponentFixture<CustomerRefSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerRefSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerRefSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
