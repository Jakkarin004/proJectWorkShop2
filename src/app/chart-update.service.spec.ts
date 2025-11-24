import { TestBed } from '@angular/core/testing';

import { ChartUpdateService } from './chart-update.service';

describe('ChartUpdateService', () => {
  let service: ChartUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
