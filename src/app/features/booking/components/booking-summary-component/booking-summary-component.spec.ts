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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
