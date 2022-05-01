import { Component } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { EXAMPLE_CARDS } from './constants';
import { ImaginaryCardsGameService } from './imaginary-cards-game.service';
import { SortedCardsResponse } from './models';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public cards = '';
    public selectedExampleValue:any = '';
    public examples = EXAMPLE_CARDS;
    public result$: Observable<SortedCardsResponse> | null = null;
    public isSortingInProgress: boolean = false;

    constructor(private imaginaryCardsGameService: ImaginaryCardsGameService) {}

    public sort() {
        const cardList = this.cards.split(',').map(c => c.trim());
        this.isSortingInProgress = true;
        this.result$ = this.imaginaryCardsGameService.sortCards(cardList).pipe(
            tap(() => {
                this.isSortingInProgress = false;
            })
        );
    }
    public handleInputChange() {
        this.result$ = null;
    }

    public handleExampleSelection(event:any){
      this.selectedExampleValue = "";
    }

    public clearInput(){
      this.cards = "";
      this.result$ = null;
    }
}
