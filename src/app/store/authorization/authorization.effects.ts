import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as AuthorizationActions from './authorization.actions';
import * as CartActions from '../cart/cart.actions';
import * as OrderActions from '../order/order.actions';
import * as ShowcaseActions from '../showcase/showcase.actions';
import * as fromApp from '../../store/app.reducers';
import * as fromAuth from '../../store/authorization/authorization.reducer';
import { TokenService } from '../../services/token.service';
import { AccountService } from '../../services/account.service';
import { Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { AuthorizationState } from './authorization.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/authorization/authorization.actions';

@Injectable()
export class AuthEffects {
  private authorizationState: Observable<AuthorizationState> =
    new Observable<AuthorizationState>();

  @Effect()
  signUp = this.actions$.pipe(
    ofType(AuthorizationActions.SIGN_UP),
    map((action: AuthorizationActions.SignUp) => {
      return action.payload;
    }),
    switchMap(
      (credentials: {
        email: string;
        password: string;
        passwordRepeat: string;
      }) => {
        return this.accountService
          .createAccount(
            credentials.email,
            credentials.password,
            credentials.passwordRepeat
          )
          .pipe(
            switchMap((res) => {              
              return [
                {
                  type: AuthorizationActions.SIGN_UP_SUCCESS,
                  payload: { effect: AuthorizationActions.SIGN_UP },
                },
                {
                  type: AuthorizationActions.SIGN_IN, // Login automático
                  payload: {
                    email: credentials.email,
                    password: credentials.password,
                  },
                },
              ];
            }),
            catchError((error) =>
              of(
                new AuthorizationActions.AuthError({
                  error,
                  errorEffect: AuthorizationActions.SIGN_UP,
                })
              )
            )
          );
      }
    )
  );

  @Effect()
  signIn = this.actions$.pipe(
    ofType(AuthorizationActions.SIGN_IN),
    map((action: AuthorizationActions.SignIn) => {
      return action.payload;
    }),
    switchMap((credentials: { email: string; password: string }) => {
      return this.tokenService
        .obtainAccessToken(credentials.email, credentials.password)
        .pipe(
          switchMap((res: any) => {
            this.tokenService.saveToken(res);
            return [
              {
                type: AuthorizationActions.UPDATE_USER_ROLE,
                payload: { userRole: res.roles },
              },
              {
                type: AuthorizationActions.SIGN_IN_SUCCESS,
                payload: { effect: AuthorizationActions.SIGN_IN },
              },
              { type: AuthorizationActions.FETCH_VERIFICATION_STATUS }              
            ];
          }),
          catchError((error) =>
            of(
              new AuthorizationActions.AuthError({
                error,
                errorEffect: AuthorizationActions.SIGN_IN,
              })
            )
          )
        );
    }),
    tap(() => {
      this.store
        .select('authorization')
        .pipe(take(1))
        .subscribe((authState: fromAuth.AuthorizationState) => {
          if (authState.authenticated) {
            if (authState.userRole.includes('ROLE_ADMIN')) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }
        });
    })
  );

  @Effect()
  googleSignIn$ = this.actions$.pipe(
    ofType(AuthorizationActions.GOOGLE_SIGN_IN),
    map(
      (action: AuthorizationActions.GoogleSignIn) =>
        action.payload.googleSignInRequest
    ),
    switchMap(
      (googleSignInRequest: {
        email: string;
        firstName: string;
        lastName: string;
        providerId: string;
        provider: string;
        idToken: string;
      }) =>
        this.accountService.signInWithGoogle(googleSignInRequest).pipe(
          switchMap((res) => {
            this.tokenService.saveToken(res);
            return [
              {
                type: AuthorizationActions.UPDATE_USER_ROLE,
                payload: { userRole: res.roles },
              },
              {
                type: AuthorizationActions.GOOGLE_SIGN_IN_SUCCESS,
                payload: { effect: AuthorizationActions.GOOGLE_SIGN_IN },
              },
              { type: AuthorizationActions.FETCH_VERIFICATION_STATUS }
            ];
          }),
          catchError((error) =>
            of(
              new AuthorizationActions.AuthError({
                error,
                errorEffect: AuthorizationActions.GOOGLE_SIGN_IN,
              })
            )
          )
        )
    ),
    tap(() => {
      this.store
        .select('authorization')
        .pipe(take(1))
        .subscribe((authState: fromAuth.AuthorizationState) => {
          if (authState.authenticated) {
            if (authState.userRole.includes('ROLE_ADMIN')) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }
        });
    })
  );

  @Effect()
  signOut = this.actions$.pipe(
    ofType(AuthorizationActions.SIGN_OUT),
    concatMap((action: AuthorizationActions.SignOut) => {
      this.tokenService.removeToken();
      return [
        {
          type: AuthorizationActions.SIGN_OUT_SUCCESS,
        },
        {
          type: CartActions.EMPTY_CART_SUCCESS,
        },
        {
          type: OrderActions.EMPTY_ORDER,
        },
        {
          type: ShowcaseActions.EMPTY_INTERESTED,
        },
      ];
    })
  );

  @Effect()
  checkIfLoggedIn = this.actions$.pipe(
    ofType(AuthorizationActions.CHECK_IF_LOGGED_IN),
    switchMap((action: AuthorizationActions.CheckIfLoggedIn) => {
      if (this.tokenService.checkIfTokenExists()) {
        return [
          {
            type: AuthorizationActions.SIGN_IN_SUCCESS,
            payload: { effect: AuthorizationActions.SIGN_IN_SUCCESS },
          },
          {
            type: AuthorizationActions.FETCH_VERIFICATION_STATUS,
          },
        ];
      }
      return [
        {
          type: AuthorizationActions.SIGN_OUT_SUCCESS,
          payload: { effect: AuthorizationActions.SIGN_OUT },
        },
      ];
    })
  );

  @Effect()
  fetchVerificationStatus = this.actions$.pipe(
    ofType(AuthorizationActions.FETCH_VERIFICATION_STATUS),
    switchMap((action: AuthorizationActions.FetchVerificationStatus) => {
      return this.accountService.getVerificationStatus().pipe(
        map((res) => {
          return {
            type: AuthorizationActions.FETCH_VERIFICATION_STATUS_SUCCESS,
            payload: res,
          };
        }),
        catchError((error) => of(new AuthorizationActions.SignOut()))
      );
    })
  );

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private tokenService: TokenService,
    private router: Router,
    private accountService: AccountService
  ) {
    this.authorizationState = this.store.select('authorization');
  }
}
