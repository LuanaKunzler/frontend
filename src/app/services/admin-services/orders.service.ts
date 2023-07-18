import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { OrderResponse, Orders } from 'src/app/store/model';
import { config } from '../../../../src/config/local';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  baseUrl = config.apiAdmin;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  snackBarToast(msg: string) {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    })
  }

  getOrders(pageIndex: number, pageSize: number, sortDirection: string, sortField: string): Observable<OrderResponse> {
    const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', sortField + ',' + sortDirection)

    return this.http.get<OrderResponse>(this.baseUrl + '/orders', { params });
  }

  getOrderById(id: any): Observable<Orders> {
    return this.http.get<Orders>(this.baseUrl + `/order/${id}`);
  }

  getBooksSoldByMonth(year: number, month: number): Observable<number> {
    const url = `${this.baseUrl}/order/sold/${year}/${month}`;
    return this.http.get<number>(url);
  }

  getRecentOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>(this.baseUrl + '/order/recent');
  }

  getTotalRevenueByMonth(year: number, month: number): Observable<number> {
    const url = `${this.baseUrl}/order/revenue/${year}/${month}`;
    return this.http.get<number>(url);
  }

  getTotalSalesAmount(): Observable<number> {
    return this.http.get<number>(this.baseUrl + '/order/total-sales-amount');
  }

  updateOrder(id: any, order: Orders): Observable<Orders> {
    return this.http.put<Orders>(this.baseUrl + `/order/${id}`, order);
  }

  deleteOrderById(id: any): Observable<Orders> {
    return this.http.delete<Orders>(this.baseUrl + `/order/${id}`);
  }
}
