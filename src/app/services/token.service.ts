import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { config } from '../../config/local';
//import Cookies from 'js-cookie';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import * as AuthActions from '../store/authorization/authorization.actions';


@Injectable()
export class TokenService {

  url = `${config.apiUrl}`;
  publicUrl = `${config.apiUrl}/api/public/account`;

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
  }


  obtainAccessToken(email: string, password: string) {
    const body = { email, password };
    return this.httpClient.post(`${this.publicUrl}/signin`, body);    
  }
  

  obtainAccessTokenWithRefreshToken(refreshToken?: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`
      })
    };
    return this.httpClient.post<any>(this.url, {}, httpOptions);
  }

  saveToken(token: any): void {
    this.cookieService.set('usr', JSON.stringify(token), 365);
  }

  removeToken() {
    this.cookieService.delete('usr');
  }

  getToken() {
    const token = this.cookieService.get('usr');
    if (!token) {
      return '';
    }
    return JSON.parse(token).accessToken;
  }

  getRefreshToken() {
    const token = this.cookieService.get('usr');
    if (!token) {
      return '';
    }
    return JSON.parse(token).refresh_token;
  }

  checkIfTokenExists() {
    const token = this.cookieService.get('usr');
    if (!token) {
      return false;
    }
    return JSON.parse(token).access_token && JSON.parse(token).access_token.length;
  }
}
