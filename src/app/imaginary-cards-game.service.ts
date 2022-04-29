import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments';

@Injectable({
    providedIn: 'root',
})
export class ImaginaryCardsGameService {
    constructor(private httpClient: HttpClient) {}

    public sortCards(cards: string[]): Observable<string[]> {
        const url = `${environment.imaginaryCardsGameServiceURL}/cards/sort`;
        return this.httpClient.post<string[]>(url, cards);
    }
}
