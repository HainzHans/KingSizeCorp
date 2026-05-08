import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KingSizePage } from './king-size-page';

describe('KingSizePage', () => {
  let component: KingSizePage;
  let fixture: ComponentFixture<KingSizePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KingSizePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KingSizePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
