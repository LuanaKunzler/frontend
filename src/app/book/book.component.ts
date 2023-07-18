import { LocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, Observable, Subscription, take, throwError } from 'rxjs';
import { BookService } from '../services/book.service';
import { CartState } from '../store/cart/cart.reducer';
import * as CartActions from '../store/cart/cart.actions';
import { Book } from '../store/model';
import * as fromApp from '../store/app.reducers';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnDestroy {

  paramSubscription: Subscription = new Subscription;

  book: Book | any;

  cartState: Observable<CartState> = new Observable<CartState>();
  innerLoading = true;

  bookUrl: string = '';

  isPopState = false;
  fetchError: HttpErrorResponse | null = null;
  routerSubscription: Subscription = new Subscription;

  activeTab = 1;


  constructor(private router: Router, private route: ActivatedRoute,
              private locStrat: LocationStrategy,
              private bookService: BookService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.locStrat.onPopState(() => {
      this.isPopState = true;
    });

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && !this.isPopState) {
        window.scrollTo(0, 0);
        this.isPopState = false;
      }
      
      if (event instanceof NavigationEnd) {
        this.isPopState = false;
      }
    });

    this.cartState = this.store.select('cart');
    this.paramSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.bookUrl = params['bookUrl'];

        this.innerLoading = true;
        this.bookService.getFullBook(this.bookUrl)
          .pipe(take(1), catchError(
            error => {
              this.fetchError = error;
              this.innerLoading = false;
              return throwError(error);
            }
          ))
          .subscribe(
            (data: Book) => {
              this.book = data;
              this.innerLoading = false;              
            }
          );
      }
    );

  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

  }

  setActiveTab(tab: number) {
    this.activeTab = tab;
  }

  addToCart(amountElement: HTMLInputElement): void {
    const amount = amountElement.value;
    const reg = new RegExp('^[0-9]+$');
    if (!reg.test(amount) || parseInt(amount) === 0) {
      alert('Insira um valor válido.');
      return;
    }

    this.store.select('authorization')
    .pipe(take(1))
    .subscribe((data: { authenticated: boolean }) => {
      if (data.authenticated) {
        this.store.dispatch(new CartActions.AddToCart({ id: this.book.id, amount }));
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

}
