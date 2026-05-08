import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChipComponent } from './main-chip-component';

describe('MainChipComponent', () => {
  let component: MainChipComponent;
  let fixture: ComponentFixture<MainChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainChipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainChipComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
