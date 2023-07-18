import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, map } from "rxjs";
import * as fromAuth from '../store/authorization/authorization.reducer';

@Injectable()
export class AdminAuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<fromAuth.AuthorizationState>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.checkAdminRole().pipe(
      map((isAdmin: boolean) => {
        if (isAdmin) {
          return true;
        } else {
          return this.router.parseUrl('/');
        }
      })
    );
  }
  
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }

  private checkAdminRole(): Observable<boolean> {
    return this.store.select((state: any) => state.authorization)
      .pipe(
        map((authState: fromAuth.AuthorizationState) => {
          if (authState.userRole.includes('ROLE_ADMIN')) {
            return true;
          } else {
            return false;
          }
        })
      );
  }
}
