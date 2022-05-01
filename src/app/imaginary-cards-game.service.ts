import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '@environments';
import { SortedCardsResponse } from './models';

@Injectable({
    providedIn: 'root',
})
export class ImaginaryCardsGameService {
    constructor(private httpClient: HttpClient) {}

    public sortCards(cards: string[]): Observable<SortedCardsResponse> {
        const url = `${environment.imaginaryCardsGameServiceURL}/cards/sort`;
        return this.httpClient.post<string[]>(url, cards).pipe(
            map(res => ({ result: res } as SortedCardsResponse)),
            catchError(err => {
                console.log(err);
                return of({ error: 'Error encountered while the sorting the cards.', result: [] });
            })
        );
    }
}
