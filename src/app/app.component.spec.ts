import { CommonModule } from '@angular/common';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { map } from 'rxjs';
import { of, timer } from 'rxjs';
import { AppComponent } from './app.component';
import { ImaginaryCardsGameService } from './imaginary-cards-game.service';
import { SharedModule } from './shared.module';

class MockImaginaryCardsGameService {
    sortCards = jasmine.createSpy('sortCards');
}

describe('Unit Test - AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let mockImaginaryCardsGameService: MockImaginaryCardsGameService;
    let loader: HarnessLoader;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, SharedModule, FormsModule, NoopAnimationsModule],
            declarations: [AppComponent],
        }).compileComponents();
        TestBed.overrideProvider(ImaginaryCardsGameService, {
            useFactory: () => new MockImaginaryCardsGameService(),
        });
        fixture = getTestBed().createComponent(AppComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        mockImaginaryCardsGameService = getTestBed().inject(
            ImaginaryCardsGameService
        ) as unknown as MockImaginaryCardsGameService;
    });

    it('should create the app', () => {
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have card rendered with title 'Imaginary Cards Game'`, () => {
        fixture.detectChanges();
        const cardTitle = fixture.debugElement.query(By.css('mat-card-title'))
            .nativeElement as HTMLElement;
        expect(cardTitle.innerText).toEqual('Imaginary Cards Game');
    });

    it(`sort: should toggle the sorting progress and sortCards method of the ImaginaryCardsGameService be called`, () => {
        mockImaginaryCardsGameService.sortCards.and.returnValue(of({ result: ['10D'] }));
        const app = fixture.componentInstance;
        const sortProgress = app.isSortingInProgress;
        app.cards = '10D';
        app.sort();
        expect(app.isSortingInProgress).toEqual(!sortProgress);
        expect(app.result$).toBeTruthy();
        expect(mockImaginaryCardsGameService.sortCards).toHaveBeenCalled();
        expect(mockImaginaryCardsGameService.sortCards).toHaveBeenCalledWith(['10D']);
    });

    it(`should reset the cards input text and result upon calling the clearInput method`, () => {
        const app = fixture.componentInstance;
        app.cards = '10D';
        app.result$ = of({ result: [] });
        app.clearInput();
        expect(app.cards).toBe('');
        expect(app.result$).toBeNull();
    });

    it('should be rendered with "Sort The Cards" button in disabled state, if the cards input is empty', () => {
        fixture.detectChanges();
        const sortCardsButton = fixture.debugElement.query(By.css('button[mat-flat-button]'))
            .nativeElement as HTMLButtonElement;
        expect(sortCardsButton.disabled).toBeTrue();
    });

    it('should be rendered with "Sort The Cards" button in disabled state, if sorting is in progress', async () => {
        mockImaginaryCardsGameService.sortCards.and.returnValue(
            timer(2000).pipe(map(() => ({ result: ['10D'] })))
        );
        fixture.detectChanges();
        let sortButton;
        const cardsInput = await loader.getHarness(MatInputHarness);
        await cardsInput.setValue('10D');
        sortButton = await loader.getHarness(MatButtonHarness);
        await expectAsync(sortButton.isDisabled()).toBeResolvedTo(false);
        await sortButton.click();
        sortButton = await loader.getHarness(MatButtonHarness);
        await expectAsync(sortButton.isDisabled()).toBeResolvedTo(true);
    });

    it('should be rendered with be "Sorted Cards" container with inner text containing the result when sorting is successful.', async () => {
        mockImaginaryCardsGameService.sortCards.and.returnValue(
            timer(1000).pipe(map(() => ({ result: ['4T', '10D'] })))
        );
        fixture.detectChanges();
        const cardsInput = await loader.getHarness(MatInputHarness);
        await cardsInput.setValue('10D,4T');
        const sortButton = await loader.getHarness(
            MatButtonHarness.with({ selector: '.sort-button' })
        );
        await sortButton.click();
        const successResult = fixture.debugElement.query(By.css('p.success-result'))
            ?.nativeElement as HTMLParagraphElement;
        expect(JSON.parse(successResult.textContent!.trim())).toEqual(['4T', '10D']);
    });

    it('should be rendered with be error container with inner text containing the description when sorting is resulted in error.', async () => {
        mockImaginaryCardsGameService.sortCards.and.returnValue(
            timer(1000).pipe(
                map(() => ({ error: 'Error encountered while the sorting the cards.', result: [] }))
            )
        );
        fixture.detectChanges();
        const cardsInput = await loader.getHarness(MatInputHarness);
        await cardsInput.setValue('10D');
        const sortButton = await loader.getHarness(
            MatButtonHarness.with({ selector: '.sort-button' })
        );
        await sortButton.click();
        const successResult = fixture.debugElement.query(By.css('p.error-result'))
            ?.nativeElement as HTMLParagraphElement;
        expect(successResult.textContent!.trim()).toBe(
            'Error encountered while the sorting the cards.'
        );
    });
});
