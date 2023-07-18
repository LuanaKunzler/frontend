import { BrowseState } from './../store/browse/browse.reducer';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as fromApp from '../store/app.reducers';
import { Store } from '@ngrx/store';
import * as BrowseActions from '../store/browse/browse.actions';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit, OnDestroy {


  sortBy = [
    {
      display: 'Tudo',
      value: 'any'
    },
    {
      display: 'Menor Preço',
      value: 'lowest'
    },
    {
      display: 'Maior Preço',
      value: 'highest'
    }
  ];

  browseOptionsForm: FormGroup | any;

  browseState: Observable<BrowseState> = new Observable<BrowseState>();;
  canFetchSubscription: Subscription = new Subscription;

  canFetch = false;
  selectedPage = 0;
  selectedSort = 'any';
  selectedCategory = 'any';
  selectedAuthor = 'any';
  minPrice = '0';
  maxPrice = '0';

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.browseState = this.store.select('browse');
    this.canFetchSubscription = this.browseState.subscribe(data => {
      this.canFetch = data.canFetch;
    });

    this.browseState.pipe(take(1)).subscribe(data => {
      this.selectedPage = data.selectedPage;
      this.selectedSort = data.selectedSort;
      this.selectedCategory = data.selectedCategory;
      this.selectedAuthor = data.selectedAuthor;
      this.minPrice = data.minPrice;
      this.maxPrice = data.maxPrice;

      if (data.categories.length === 0) {
        this.store.dispatch(new BrowseActions.FetchCategory());
      }
      if (!data.authors || data.authors.length === 0) {
        this.store.dispatch(new BrowseActions.FetchAuthors());
      }
      if (data.books.length === 0) {
        this.getBooks();
      }
    });


  }

  ngOnDestroy(): void {
    if (this.canFetchSubscription) {
      this.canFetchSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event: Event): void {
    if ((window.innerHeight + window.scrollY + 400) >= document.body.offsetHeight) {
      if (this.canFetch) {
        this.getBooksAppend();
      }
    }
  }

  selectMin(event: any) {
    const minPrice = event.target.value.trim().length === 0 ? '0' : event.target.value.trim();
    this.minPrice = minPrice;
    this.getBooks();
  }

  selectMax(event: any) {
    const maxPrice = event.target.value.trim().length === 0 ? '0' : event.target.value.trim();
    this.maxPrice = maxPrice;
    this.getBooks();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.getBooks();
  }

  selectAuthor(author: string) {
    this.selectedAuthor = author;
    this.getBooks();
  }

  selectSort(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSort = target.value;    
    this.getBooks();
  }

  clearCategory() {
    this.selectedCategory = 'any';
    this.getBooks();
  }


  clearPrice() {
    this.minPrice = '0';
    this.maxPrice = '0';
    this.getBooks();
  }

  clearAuthor() {
    this.selectedAuthor = 'any';
    this.getBooks();
  }


  getBooks() {
    this.selectedPage = 0;
    this.store.dispatch(new BrowseActions.FetchBooks({ page: this.selectedPage, sort: this.selectedSort, category: this.selectedCategory, author: this.selectedAuthor, minPrice: this.minPrice, maxPrice: this.maxPrice }));    
    this.getBooksCount();
    this.selectedPage++;
  }

  getBooksCount() {
    this.store.dispatch(new BrowseActions.FetchBooksCount({ category: this.selectedCategory, author: this.selectedAuthor, minPrice: this.minPrice, maxPrice: this.maxPrice }));
  }

  getBooksAppend() {
    this.store.dispatch(new BrowseActions.FetchBooksAppend({ page: this.selectedPage, sort: this.selectedSort, category: this.selectedCategory, author: this.selectedAuthor, minPrice: this.minPrice, maxPrice: this.maxPrice }));
    this.selectedPage++;
  }
}
