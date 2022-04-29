import { TestBed } from '@angular/core/testing';

import { ImaginaryCardsGameService } from './imaginary-cards-game.service';

describe('ImaginaryCardsGameService', () => {
  let service: ImaginaryCardsGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImaginaryCardsGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
