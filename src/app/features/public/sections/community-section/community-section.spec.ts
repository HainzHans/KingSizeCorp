import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySection } from './community-section';

describe('CommunitySection', () => {
  let component: CommunitySection;
  let fixture: ComponentFixture<CommunitySection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunitySection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunitySection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
