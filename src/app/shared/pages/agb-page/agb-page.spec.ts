import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgbPage } from './agb-page';

describe('AgbPage', () => {
  let component: AgbPage;
  let fixture: ComponentFixture<AgbPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgbPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgbPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
