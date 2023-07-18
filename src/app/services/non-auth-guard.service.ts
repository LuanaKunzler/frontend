import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as fromAuth from '../store/authorization/authorization.reducer';
import { map, take } from 'rxjs/operators';

@Injectable()
export class NonAuthGuardService implements CanActivate {

  constructor(private store: Store<fromApp.AppState>, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('authorization')
      .pipe(map((authState: fromAuth.AuthorizationState) => {
        if (authState.authenticated) {
          this.router.navigate(['/']);
        }
        return !authState.authenticated;
      }));
  }
}
