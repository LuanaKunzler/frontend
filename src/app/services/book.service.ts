import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../config/local';
import { Book, BookResponse, BookCategory, Authors } from '../store/model';

@Injectable()
export class BookService {

  publicUrl = `${config.apiUrl}/api/public/book`;
  categoryUrl = `${config.apiUrl}/api/public/category`;
  authorUrl = `${config.apiUrl}/api/public/authors`;

  browsePageSize = 20;
  searchPageSize = 10;

  constructor(private httpClient: HttpClient) {
  }

  getBooks(page: number, sort: string, category: string, author: string, minPrice: string, maxPrice: string): Observable<Object[]> | undefined {
    if (page === undefined || page === null || page < 0) {
      return;
    }
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('size', this.browsePageSize.toString());
    if (sort !== undefined && sort !== null && sort !== 'any') {
      params = params.set('sort', sort);
    }
    if (category && category !== 'any') {
      params = params.set('category', category);
    }

    if (author && author !== 'any') {
      params = params.set('author', author);
    }

    if (minPrice && minPrice !== '0') {
      params = params.set('minPrice', minPrice);
    }

    if (maxPrice && maxPrice !== '0') {
      params = params.set('maxPrice', maxPrice);
    }

    return this.httpClient.get<Object[]>(this.publicUrl,
      {
        params
      });
  }

  getBooksCount(category: string, author: string, minPrice: string, maxPrice: string) {
    let params = new HttpParams();
    if (category && category !== 'any') {
      params = params.set('category', category);
    }

    if (author && author !== 'any') {
      params = params.set('author', author);
    }

    if (minPrice && minPrice !== '0') {
      params = params.set('minPrice', minPrice);
    }

    if (maxPrice && maxPrice !== '0') {
      params = params.set('maxPrice', maxPrice);
    }

    return this.httpClient.get<number>(`${this.publicUrl}/count`,
      {
        params
      });
  }

  getFullBook(bookUrl: string) {
    return this.httpClient.get<Book>(`${this.publicUrl}/${bookUrl}`);
  }

  getRelatedBooks(bookUrl: string) {
    return this.httpClient.get<Array<Book>>(`${this.publicUrl}/related/${bookUrl}`);
  }

  getNewlyAdded() {
    return this.httpClient.get<Array<Book>>(this.publicUrl + '/recent');
  }

  getMostSelling() {
    return this.httpClient.get<Array<BookResponse>>(this.publicUrl + '/mostselling');
  }

  getInterested() {
    return this.httpClient.get<Array<Book>>(this.publicUrl + '/interested');
  }

  searchBook(page: number, keyword: string) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('keyword', keyword);
    params = params.set('size', this.searchPageSize.toString());
    return this.httpClient.get<Array<Book>>(this.publicUrl + '/search', {
      params
    });
  }

  getCategory() {
    return this.httpClient.get<Array<BookCategory>>(this.categoryUrl);
  }

  getAuthors() {
    return this.httpClient.get<Array<Authors>>(this.authorUrl);
  }
  
}
