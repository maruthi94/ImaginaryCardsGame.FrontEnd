import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ImaginaryCardsGameService } from './imaginary-cards-game.service';

describe('Unit Test - ImaginaryCardsGameService', () => {
    let service: ImaginaryCardsGameService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ImaginaryCardsGameService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('sortCards: should make the http request for sorting the cards and returns the SortedCardsResponse with no error', done => {
        const cards = ['JS', '8S'];
        service.sortCards(cards).subscribe(response => {
            expect(response).toEqual({ result: ['8S', 'JS'] });
            done();
        });
        const sortRequest = httpMock.expectOne('https://localhost:7208/api/cards/sort');
        expect(sortRequest.request.method).toBe('POST');
        sortRequest.flush(['8S', 'JS']);
    });

    it('sortCards: should return the SortedCardsResponse with error if it receive non success response from the http request', done => {
      const cards = ['JS', '8S'];
      service.sortCards(cards).subscribe(response => {
          expect(response).toEqual({ result:[],error:"Error encountered while the sorting the cards."});
          done();
      });
      const sortRequest = httpMock.expectOne('https://localhost:7208/api/cards/sort');
      expect(sortRequest.request.method).toBe('POST');
      sortRequest.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
});
