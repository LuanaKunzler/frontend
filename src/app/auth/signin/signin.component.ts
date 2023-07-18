import { AuthorizationState } from './../../store/authorization/authorization.reducer';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AuthActions from '../../store/authorization/authorization.actions';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {
  GoogleSignInFailure,
  GoogleSignUpFailure,
  GoogleSignUpSuccess,
  SignUp,
} from '../../store/authorization/authorization.actions';
import { MyHttpError } from 'src/app/common/myHttpError';
import { TokenService } from 'src/app/services/token.service';
import { GoogleSignInRequest } from 'src/app/store/model';
import { ErrorMessage } from 'src/app/common/messages';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signInForm: FormGroup | any;
  emailPattern = '^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$';

  authorizationState: Observable<AuthorizationState> = new Observable<AuthorizationState>();


  constructor(private store: Store<fromApp.AppState>, private afAuth: AngularFireAuth, private tokenService: TokenService) {
  }

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(52)]),
    });

    this.authorizationState = this.store.select('authorization');
  }

  onSubmitted() {
    this.store.dispatch(new AuthActions.SignIn({
      email: this.signInForm.value.email,
      password: this.signInForm.value.password
    }));
  }

  onGoogleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.signInWithPopup(provider)
      .then(async (result) => {
        const user = result.user;
        const credential = result.credential;
        
        if (user && credential && 'accessToken' in credential) {
          const idToken = await user.getIdToken();
          const googleSignInRequest: GoogleSignInRequest = {
              email: user.email || '',
              firstName: user.displayName ? user.displayName.split(' ')[0] : '',
              lastName: user.displayName ? user.displayName.split(' ')[1] : '',
              providerId: user.uid,
              provider: 'GOOGLE',
              idToken: idToken
          };
      
          this.store.dispatch(new AuthActions.GoogleSignIn({ googleSignInRequest }));
      }
      })
      .catch((error) => {
        const httpError = new MyHttpError(
          error,
          ErrorMessage.GOOGLE_LOGIN_FAILURE
        );
        const action = new GoogleSignInFailure(httpError);
        this.store.dispatch(action);
      });
  }
  
  

}
