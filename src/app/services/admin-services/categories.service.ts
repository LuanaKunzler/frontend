import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { BookCategory, BookCategoryResponse } from 'src/app/store/model';
import { config } from '../../../../src/config/local';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  baseUrl = config.apiAdmin;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  snackBarToast(msg: string) {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    })
  }

  createCategory(category: any) {
    return this.http.post(this.baseUrl + '/category', category);
  }

  getCategories(pageIndex: number, pageSize: number, sortDirection: string, sortField: string): Observable<BookCategoryResponse> {
    const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', sortField + ',' + sortDirection)

    return this.http.get<BookCategoryResponse>(this.baseUrl + '/categories', { params });
  }

  getCategoryById(id: any): Observable<BookCategory> {
    return this.http.get<BookCategory>(this.baseUrl + `/category/${id}`);
  }

  updateCategory(id: any, category: BookCategory): Observable<BookCategory> {
    return this.http.put<BookCategory>(this.baseUrl + `/category/${id}`, category);
  }

  deleteCategoryById(id: any): Observable<BookCategory> {
    return this.http.delete<BookCategory>(this.baseUrl + `/category/${id}`);
  }
}
