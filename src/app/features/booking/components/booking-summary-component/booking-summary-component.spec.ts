import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSummaryComponent } from './booking-summary-component';

describe('BookingSummaryComponent', () => {
  let component: BookingSummaryComponent;
  let fixture: ComponentFixture<BookingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', 'mentoring');
    fixture.componentRef.setInput('fullName', 'Max Mustermann');
    fixture.componentRef.setInput('phone', '+49 123 456789');
    fixture.componentRef.setInput('email', 'max@example.com');
    fixture.componentRef.setInput('slot', undefined);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
