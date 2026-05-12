import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroSection } from './intro-section';

describe('IntroSection', () => {
  let component: IntroSection;
  let fixture: ComponentFixture<IntroSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
