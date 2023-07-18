import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Book, BookContent, BookRequest } from 'src/app/store/model';
import { config } from '../../../../src/config/local';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  baseUrl = config.apiAdmin;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  snackBarToast(msg: string) {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    })
  }

  createBook(imageFile: File, product: BookRequest) {
    const formData = new FormData();
    formData.set('imageUrl', imageFile);
    formData.append('title', product.title);
    formData.append('longDesc', product.longDesc);
    formData.append('bookCategory.id', String(Number(product.bookCategory.id)));
    formData.append('bookCategory.name', product.bookCategory.name);
    formData.append('bookAuthor.id', String(Number(product.author.id)));
    formData.append('bookAuthor.name', product.author.name);
    formData.append('isbn', String(Number(product.isbn)));
    formData.append('bookEdition', product.bookEdition);
    formData.append('numberOfPages', product.numberOfPages.toString());
    formData.append('language', product.language);
    formData.append('bookUrl', product.bookUrl);
    formData.append('unitPrice', product.unitPrice.toString());
    formData.append('unitsInStock', product.unitsInStock.toString());
    formData.append('isActive', product.isActive.toString());
  
    return this.http.post(this.baseUrl + '/book', formData);
  }

  getBooks(pageIndex: number, pageSize: number, sortDirection: string, sortField: string): Observable<BookContent> {
    const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', sortField + ',' + sortDirection)

    return this.http.get<BookContent>(this.baseUrl + '/books', { params });
  }

  getBookById(id: any): Observable<Book> {
    return this.http.get<Book>(this.baseUrl + `/book/${id}`);
  }

  updateBook(id: any, imageFile: File, product: BookRequest) {
    const formData = new FormData();
    formData.append('imageUrl', imageFile);
    formData.append('title', product.title);
    formData.append('longDesc', product.longDesc);
    formData.append('bookCategory.id', String(Number(product.bookCategory.id)));
    formData.append('bookCategory.name', product.bookCategory.name);
    formData.append('bookAuthor.id', String(Number(product.author.id)));
    formData.append('bookAuthor.name', product.author.name);
    formData.append('isbn', String(Number(product.isbn)));
    formData.append('bookEdition', product.bookEdition);
    formData.append('numberOfPages', product.numberOfPages.toString());
    formData.append('language', product.language);
    formData.append('bookUrl', product.bookUrl);
    formData.append('unitPrice', product.unitPrice.toString());
    formData.append('unitsInStock', product.unitsInStock.toString());
    formData.append('isActive', product.isActive.toString());
  
    return this.http.put(this.baseUrl + `/book/${id}`, formData);
  }

  deleteBookById(id: any): Observable<Book> {
    return this.http.delete<Book>(this.baseUrl + `/book/${id}`);
  }
}
