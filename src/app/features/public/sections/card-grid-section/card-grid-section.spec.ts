import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGridSection } from './card-grid-section';

describe('CardGridSection', () => {
  let component: CardGridSection;
  let fixture: ComponentFixture<CardGridSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGridSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGridSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
