import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Discount, DiscountResponse } from 'src/app/store/model';
import { config } from '../../../../src/config/local';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {

  baseUrl = config.apiAdmin;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  snackBarToast(msg: string) {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    })
  }

  createDiscount(discount: any) {
    return this.http.post(this.baseUrl + '/discount', discount);
  }

  getDiscounts(pageIndex: number, pageSize: number, sortDirection: string, sortField: string): Observable<DiscountResponse> {
    const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', sortField + ',' + sortDirection)

    return this.http.get<DiscountResponse>(this.baseUrl + '/discounts', { params });
  }

  getDiscountById(id: any): Observable<Discount> {
    return this.http.get<Discount>(this.baseUrl + `/discount/${id}`);
  }

  updateDiscount(id: any, discount: Discount): Observable<Discount> {
    return this.http.put<Discount>(this.baseUrl + `/discount/${id}`, discount);
  }

  deleteDiscountById(id: any): Observable<Discount> {
    return this.http.delete<Discount>(this.baseUrl + `/discount/${id}`);
  }
}
