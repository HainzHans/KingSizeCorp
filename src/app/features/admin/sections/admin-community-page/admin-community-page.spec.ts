import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommunityPage } from './admin-community-page';

describe('AdminCommunityPage', () => {
  let component: AdminCommunityPage;
  let fixture: ComponentFixture<AdminCommunityPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCommunityPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCommunityPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
