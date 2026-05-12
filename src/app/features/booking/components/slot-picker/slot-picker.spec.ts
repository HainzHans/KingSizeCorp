import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotPicker } from './slot-picker';

describe('SlotPicker', () => {
  let component: SlotPicker;
  let fixture: ComponentFixture<SlotPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
