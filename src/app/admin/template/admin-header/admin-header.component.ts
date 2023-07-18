import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import * as AuthorizationActions from '../../../store/authorization/authorization.actions';
import * as fromAuth from '../../../store/authorization/authorization.reducer';
import * as fromApp from '../../../store/app.reducers';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthorizationState } from '../../../store/authorization/authorization.reducer';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  isCollapsed = true;
  authorizationState: Observable<AuthorizationState> = new Observable<AuthorizationState>();
  @Output() menuClicked = new EventEmitter<void>();

  constructor(private store: Store<fromApp.AppState>, public router: Router) {}
  
  ngOnInit(): void {
    this.authorizationState = this.store.select('authorization');
  }

  switchToUserMode() {
    this.store.select('authorization')
      .pipe(take(1))
      .subscribe((authState: fromAuth.AuthorizationState) => {
        if (authState.authenticated && authState.userRole.includes('ROLE_USER')) {
          // Define uma variável de estado indicando que o modo cliente está ativado
          this.store.dispatch(new AuthorizationActions.SetUserMode(true));

          // Redireciona para a rota do modo cliente
          this.router.navigate(['/']);
        }
      });
  }

  toggleSidenav() {
    this.menuClicked.emit();
  }

  userSignOut() {
    this.store.dispatch(new AuthorizationActions.SignOut());
    this.router.navigate(['/']);
  }

}
