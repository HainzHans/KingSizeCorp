import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPrivacyPage } from './data-privacy-page';

describe('DataPrivacyPage', () => {
  let component: DataPrivacyPage;
  let fixture: ComponentFixture<DataPrivacyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPrivacyPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataPrivacyPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
