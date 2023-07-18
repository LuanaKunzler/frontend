import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Author, Authors, AuthorsResponse } from 'src/app/store/model';
import { config } from '../../../../src/config/local';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  baseUrl = config.apiAdmin;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  snackBarToast(msg: string) {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    })
  }

  createAuthor(author: any) {
    return this.http.post(this.baseUrl + '/author', author);
  }

  getAuthors(pageIndex: number, pageSize: number, sortDirection: string, sortField: string): Observable<AuthorsResponse> {
    const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', sortField + ',' + sortDirection)

    return this.http.get<AuthorsResponse>(this.baseUrl + '/authors', { params });
  }

  getAuthorById(id: any): Observable<Author> {
    return this.http.get<Author>(this.baseUrl + `/author/${id}`);
  }

  updateAuthor(id: any, author: Author): Observable<Author> {
    return this.http.put<Author>(this.baseUrl + `/author/${id}`, author);
  }

  deleteAuthorById(id: any): Observable<Author> {
    return this.http.delete<Author>(this.baseUrl + `/author/${id}`);
  }
}
