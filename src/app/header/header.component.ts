import { AuthorizationState } from './../store/authorization/authorization.reducer';
import { CartState } from './../store/cart/cart.reducer';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as CartActions from '../store/cart/cart.actions';
import * as OrderActions from '../store/order/order.actions';
import * as AuthorizationActions from '../store/authorization/authorization.actions';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import * as fromAuth from '../store/authorization/authorization.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {


  cartState: Observable<CartState> = new Observable<CartState>();
  authorizationState: Observable<AuthorizationState> = new Observable<AuthorizationState>();

  cartItemCountSubscription: Subscription = new Subscription;
  cartItemCount = 0;
  isCollapsed = true;
  errorAlertVisible = false;
  successAlertVisible = false;

  authorizationStateSubscription: Subscription = new Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    public router: Router,
    private route: ActivatedRoute,
    public dropdownConfig: NgbDropdownConfig) {
    dropdownConfig.placement = 'bottom-right';
  }

  ngOnInit() {

    this.authorizationState = this.store.select('authorization');
    this.cartState = this.store.select('cart');

    this.authorizationStateSubscription = this.authorizationState
      .subscribe((data) => {
        if (data.authenticated) {
          this.store.dispatch(new CartActions.FetchCart());
          this.cartItemCountSubscription = this.cartState.subscribe(data => {
            if (data.cart && data.cart.cartItems.length) {
              this.cartItemCount = data.cart.cartItems.reduce((total, cartItem) => total + cartItem.amount, 0);
            } else {
              this.cartItemCount = 0;
            }
          });
        }
        else {
          if (this.cartItemCountSubscription) {
            this.cartItemCountSubscription.unsubscribe();
          }
        }
      }
      );

  }

  ngOnDestroy() {
    if (this.authorizationStateSubscription) {
      this.authorizationStateSubscription.unsubscribe();
    }
    if (this.cartItemCountSubscription) {
      this.cartItemCountSubscription.unsubscribe();
    }
  }

  switchToAdminMode() {
    this.store.select('authorization')
      .pipe(take(1))
      .subscribe((authState: fromAuth.AuthorizationState) => {
        if (authState.authenticated || authState.userRole.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
        }
      });
  }

  userSignOut() {
    this.store.dispatch(new AuthorizationActions.SignOut());
    this.router.navigate(['/']);
  }


  searchBook(search: HTMLInputElement) {
    if (search.value.trim().length) {
      const url = '/search/' + search.value;
      this.router.navigate([url]);
    }
  }

  activatePurchase() {
    this.store.select('authorization')
      .pipe(take(1))
      .subscribe(data => {
        if (data.isActive) {
          this.store.dispatch(new OrderActions.IsCheckoutActive(true));
          this.router.navigate(['/checkout/personal'], { relativeTo: this.route });
        } else {
          this.errorAlertVisible = true;
        }
      });
  }
}
