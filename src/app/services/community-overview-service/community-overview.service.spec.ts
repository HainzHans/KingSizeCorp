import { TestBed } from '@angular/core/testing';

import { CommunityOverviewService } from './community-overview.service';

describe('CommunityOverviewService', () => {
  let service: CommunityOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
