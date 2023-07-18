import { Book } from './../../store/model';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Subscription, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-related',
  templateUrl: './related.component.html',
  styleUrls: ['./related.component.scss']
})
export class RelatedComponent implements OnInit, OnDestroy {

  @ViewChild('relatedCards')
  relatedCards!: ElementRef;

  paramSubscription: Subscription = new Subscription;

  relatedBooks: Array<Book> = [];
  fetchError: HttpErrorResponse | null = null;
  bookUrl: string = '';

  innerLoading = true;

  constructor(private route: ActivatedRoute, private bookService: BookService) {
  }

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(
      (params: Params) => {

        this.innerLoading = true;
        this.bookUrl = params['bookUrl'];
        this.bookService.getRelatedBooks(this.bookUrl)
          .pipe(take(1), catchError(
            error => {
              this.fetchError = error;
              this.innerLoading = false;
              return throwError(error);
            }
          ))
          .subscribe(
            (data: Array<Book>) => {
              this.relatedBooks = data;
              this.innerLoading = false;
            });
      }
    );
  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  scrollLeft() {
    this.relatedCards.nativeElement.scrollLeft -= 325;
  }

  scrollRight() {
    this.relatedCards.nativeElement.scrollLeft += 325;
  }

}
