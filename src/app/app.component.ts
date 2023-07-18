import { Component, OnInit } from '@angular/core';
import * as fromAuth from '../../src/app/store/authorization/authorization.reducer';
import { Store, select } from '@ngrx/store';
import * as fromApp from './store/app.reducers';
import { NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import * as AuthActions from '../app/store/authorization/authorization.actions';
import { AdminComponent } from './admin/admin.component';
import { AppState } from './store/app.reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAdminRoute: boolean = false;

  constructor(private store: Store<fromApp.AppState>, private router: Router) {
  }

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.CheckIfLoggedIn());
    this.store.select((state: AppState) => state.authorization.isAdminRoute)
    .subscribe(isAdminRoute => {
      this.isAdminRoute = isAdminRoute;
    });
  }

  onActivate($event: any) {
    window.scroll(0, 0);
    if ($event instanceof AdminComponent) {
      this.store.dispatch(new AuthActions.UpdateAdminRoute(true));
    } else {
      this.store.dispatch(new AuthActions.UpdateAdminRoute(false));
    }
  }
}