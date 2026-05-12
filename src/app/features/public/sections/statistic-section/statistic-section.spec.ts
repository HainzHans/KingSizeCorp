import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticSection } from './statistic-section';

describe('StatisticSection', () => {
  let component: StatisticSection;
  let fixture: ComponentFixture<StatisticSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
