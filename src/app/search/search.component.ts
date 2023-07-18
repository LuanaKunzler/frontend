import { Book } from './../store/model';
import { Component, HostListener, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  querySubscribe: Subscription = new Subscription;
  page = 0;
  keyword: string = '';
  canFetch = false;

  books: Array<Book> = [];

  constructor(private bookService: BookService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.querySubscribe = this.route.params.subscribe((params: Params) => {
      this.canFetch = false;
      this.keyword = params['keyword'];
      this.page = 0;
      this.bookService.searchBook(this.page, this.keyword)
        .pipe(take(1), catchError(
          error => {
            this.canFetch = false;
            return throwError(() => new Error(error));
          }
        ))
        .subscribe(data => {
          this.books = data;
          this.page++;
          this.canFetch = true;
          if (data.length !== 0) {
            this.canFetch = true;
          }
        });
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event: Event): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.canFetch) {
      this.canFetch = false;
      if (this.canFetch) {
        this.bookService.searchBook(this.page, this.keyword)
          .pipe(take(1), catchError(
            error => {
              this.canFetch = false;
              return throwError(() => new Error(error));
            }
          ))
          .subscribe(data => {
            this.books.push(...data);
            this.page++;
            this.canFetch = true;
            if (data.length === 0) {
              this.canFetch = false;
            }
          });
      }
    }
  }
}
