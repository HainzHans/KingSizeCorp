import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressumPage } from './impressum-page';

describe('ImpressumPage', () => {
  let component: ImpressumPage;
  let fixture: ComponentFixture<ImpressumPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpressumPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpressumPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
