import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as AuthActions from '../store/authorization/authorization.actions';
import { TokenService } from './token.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private token: string | null;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private store: Store<fromApp.AppState>,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.token = this.tokenService.getToken();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes('/public/') || !request.url.includes('oauth')) {
      const token = this.tokenService.getToken();
      request = this.addTokenToHeader(request, token);
      return next.handle(request).pipe(
        catchError(error => {
          if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
            this.store.dispatch(new AuthActions.SignOut());
          }

          if (error && error.status === 401 && error.error && error.error.error === 'invalid_token') {
            return this.handle401Error(request, next);
          }

          return throwError(error);
        })
      );
    } else {
      return next.handle(request);
    }
  }

  private addTokenToHeader(request: HttpRequest<any>, token: string | null): HttpRequest<any> {
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);

      return this.tokenService.obtainAccessTokenWithRefreshToken().pipe(
        switchMap((newToken: any) => {
          if (typeof newToken === 'string') {
            this.token = newToken;
            this.tokenService.saveToken(newToken);
            this.refreshTokenSubject.next(newToken);
            return next.handle(this.addTokenToHeader(request, newToken));
          }

          this.store.dispatch(new AuthActions.SignOut());
          return of();
        }),
        catchError(error => {
          this.router.navigate(['/login']);
          this.store.dispatch(new AuthActions.SignOut());
          return throwError(error);
        }),
        finalize(() => {
          this.refreshTokenInProgress = false;
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addTokenToHeader(request, token));
        }),
        catchError(() => {
          this.store.dispatch(new AuthActions.SignOut());
          return of();
        })
      );
    }
  }
}
