import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User, UserResponse } from 'src/app/store/model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config } from '../../../../src/config/local';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = config.apiAdmin;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  snackBarToast(msg: string) {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    })
  }

  createUser(user: any) {
    return this.http.post(this.baseUrl + '/user', user);
  }

  getUsers(pageIndex: number, pageSize: number, sortDirection: string, sortField: string): Observable<UserResponse> {
    const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', sortField + ',' + sortDirection)

    return this.http.get<UserResponse>(this.baseUrl + '/users', { params });
  }

  getUserById(id: any): Observable<User> {
    return this.http.get<User>(this.baseUrl + `/user/${id}`);
  }

  updateUser(id: any, user: User): Observable<User> {
    return this.http.put<User>(this.baseUrl + `/user/${id}`, user);
  }

  deleteUserById(id: any): Observable<User> {
    return this.http.delete<User>(this.baseUrl + `/user/${id}`);
  }

  getUsersRegisteredByMonth(year: number, month: number): Observable<number> {
    const url = `${this.baseUrl}/user/registered/${year}/${month}`;
    return this.http.get<number>(url);
  }
}
