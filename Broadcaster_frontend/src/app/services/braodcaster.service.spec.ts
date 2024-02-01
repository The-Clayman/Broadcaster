import { TestBed } from '@angular/core/testing';

import { BraodcasterService } from './braodcaster.service';

describe('BraodcasterService', () => {
  let service: BraodcasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BraodcasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
