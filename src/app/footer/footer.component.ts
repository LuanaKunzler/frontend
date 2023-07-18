import { Component, OnInit } from '@angular/core';
import * as fromApp from '../store/app.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthorizationState } from '../store/authorization/authorization.reducer';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  authorizationState: Observable<{ authenticated: boolean, isActive: boolean }> = new Observable<AuthorizationState>();

  constructor(private store: Store<fromApp.AppState>, ) {
  }

  ngOnInit() {
    this.authorizationState = this.store.select('authorization');
  }

}
