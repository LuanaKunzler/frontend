import { GoogleSignInRequest, User } from './../store/model';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { config } from '../../config/local';
import {
  Observable,
  map,
  throwError
} from 'rxjs';
import { ErrorMessage } from '../common/messages';
import { TokenService } from './token.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../src/app/store/app.reducers';
;

@Injectable()
export class AccountService {
  publicUrl = `${config.apiUrl}/api/public/account`;
  url = `${config.apiUrl}/api/user/account`;
  googleUrl = `${config.apiUrl}/api/public/google-auth`;

  constructor(
    private store: Store<fromApp.AppState>,
    private httpClient: HttpClient,
    private tokenService: TokenService
  ) {}

  createAccount(email: string, password: string, passwordRepeat: string) {
    return this.httpClient.post(this.publicUrl + '/registration', {
      email,
      password,
      passwordRepeat
    }, { headers: { 'Content-type': 'application/json; charset=utf-8' } });
  }

  signInWithGoogle(googleSignInRequest: GoogleSignInRequest): Observable<any> {
    return this.httpClient.post(`${this.googleUrl}/google-authentication`, googleSignInRequest)
  }

  getUser(token: string): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<User>(this.url, { headers });
  }

  updateUser(user: any) {
    return this.httpClient.put(this.url, user);
  }

  updateUserAddress(user: any) {
    return this.httpClient.put(`${this.url}/address`, user);
  }

  verifyEmail(verificationToken: any) {
    return this.httpClient.post(this.publicUrl + '/registration/validate', {
      token: verificationToken,
    });
  }

  forgotPasswordRequest(email: any) {
    return this.httpClient.post(this.publicUrl + '/password/forgot', {
      email,
    });
  }

  forgotPasswordConfirm(passwordForgotToken: any) {
    return this.httpClient.post(this.publicUrl + '/password/forgot/confirm', {
      token: passwordForgotToken,
    });
  }

  forgotPasswordReset(
    passwordForgotToken: any,
    newPassword: any,
    newPasswordConfirm: any
  ) {
    return this.httpClient.post(this.publicUrl + '/password/forgot/validate', {
      token: passwordForgotToken,
      newPassword,
      newPasswordConfirm,
    });
  }

  resetPassword(oldPassword: any, newPassword: any, newPasswordConfirm: any) {
    return this.httpClient.post(this.url + '/password/reset', {
      oldPassword,
      newPassword,
      newPasswordConfirm,
    });
  }

  getVerificationStatus() {
    return this.httpClient.get(this.url + '/status');
  }

  private handleError(error: Response | any) {
    console.error(error.message || error);
    return throwError(() => new Error(error.message || error));
  }
}
