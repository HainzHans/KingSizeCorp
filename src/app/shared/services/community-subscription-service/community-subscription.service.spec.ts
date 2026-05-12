import { TestBed } from '@angular/core/testing';

import { CommunitySubscriptionService } from './community-subscription.service';

describe('CommunitySubscriptionService', () => {
  let service: CommunitySubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunitySubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
