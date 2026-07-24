import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BookingResult } from './booking-result';

describe('BookingResult', () => {
  let component: BookingResult;
  let fixture: ComponentFixture<BookingResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingResult],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingResult);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', 'success');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
