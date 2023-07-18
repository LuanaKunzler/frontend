import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { config } from '../../../../src/config/local';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  baseUrl = config.apiAdmin;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  snackBarToast(msg: string) {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    })
  }

  generatePeriodicSalesReport(startDate: Date, endDate: Date): Observable<Blob> {
    const url = `${this.baseUrl}/report/periodic-sales`;
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        Accept: 'application/pdf'
      })
    };
    const params = {
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10)
    };

    return this.http.get<Blob>(url, { ...httpOptions, params });
  }
}
