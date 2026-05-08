import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallDotComponent } from './small-dot-component';

describe('SmallDotComponent', () => {
  let component: SmallDotComponent;
  let fixture: ComponentFixture<SmallDotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallDotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallDotComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
