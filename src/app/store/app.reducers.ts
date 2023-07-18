import { Action, ActionReducer, ActionReducerMap } from '@ngrx/store';
import * as fromCart from '../store/cart/cart.reducer';
import * as fromOrder from '../store/order/order.reducer';
import * as fromAuthorization from '../store/authorization/authorization.reducer';
import * as fromShowcase from '../store/showcase/showcase.reducer';
import * as fromBrowse from '../store/browse/browse.reducer';
import { HttpErrorResponse } from '@angular/common/http';

export interface HttpError {
  error: HttpErrorResponse;
  errorEffect: string;
}

export interface AppState {
  cart: fromCart.CartState;
  order: fromOrder.OrderState;
  authorization: fromAuthorization.AuthorizationState;
  showcase: fromShowcase.ShowcaseState;
  browse: fromBrowse.BrowseState;
}

export const reducers: ActionReducerMap<AppState, Action> = {
  cart: fromCart.cartReducer as ActionReducer<fromCart.CartState, Action>,
  order: fromOrder.orderReducer as ActionReducer<fromOrder.OrderState, Action>,
  authorization: fromAuthorization.authorizationReducer as ActionReducer<fromAuthorization.AuthorizationState, Action>,
  showcase: fromShowcase.showcaseReducer as ActionReducer<fromShowcase.ShowcaseState, Action>,
  browse: fromBrowse.browseReducer as ActionReducer<fromBrowse.BrowseState, Action>
};
