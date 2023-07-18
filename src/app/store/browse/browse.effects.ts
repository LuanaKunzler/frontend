import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as BrowseActions from './browse.actions';
import { BookService } from '../../services/book.service';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

@Injectable()
export class BrowseEffects {

  @Effect()
  fetchBooks = this.actions$.pipe(
    ofType(BrowseActions.FETCH_BOOKS),
    map((action: BrowseActions.FetchBooks) => {
      return action.payload;
    }),
    switchMap(
      (params: {
        page: number;
        sort: string;
        category: string;
        author: string;
        minPrice: string;
        maxPrice: string;
      }) => {
        const books = this.bookService.getBooks(
          params.page,
          params.sort,
          params.category,
          params.author,
          params.minPrice,
          params.maxPrice
        );
        if (!books) {
          return EMPTY;
        }
        return books.pipe(
          map((res) => {
            return {
              type: BrowseActions.FETCH_BOOKS_SUCCESS,
              payload: {
                res,
                effect: BrowseActions.FETCH_BOOKS,
                selectedPage: params.page + 1,
                selectedSort: params.sort,
                selectedCategory: params.category,
                selectedAuthor: params.author,
                minPrice: params.minPrice,
                maxPrice: params.maxPrice,
              },
            };
          }),
          catchError((error) =>
            of(
              new BrowseActions.BrowseError({
                error,
                errorEffect: BrowseActions.FETCH_BOOKS,
              })
            )
          )
        );
      }
    )
  );

  @Effect()
  fetchBooksAppend = this.actions$.pipe(
    ofType(BrowseActions.FETCH_BOOKS_APPEND),
    map((action: BrowseActions.FetchBooksAppend) => {
      return action.payload;
    }),
    mergeMap(
      (params: {
        page: number;
        sort: string;
        category: string;
        author: string;
        minPrice: string;
        maxPrice: string;
      }) => {
        const books = this.bookService.getBooks(
          params.page,
          params.sort,
          params.category,
          params.author,
          params.minPrice,
          params.maxPrice
        );
        if (!books) {
          return EMPTY;
        }
        return books
          .pipe(
            map((res) => {
              return {
                type: BrowseActions.FETCH_BOOKS_APPEND_SUCCESS,
                payload: {
                  res,
                  effect: BrowseActions.FETCH_BOOKS_APPEND,
                  selectedPage: params.page + 1,
                  selectedSort: params.sort,
                  selectedCategory: params.category,
                  selectedAuthor: params.author,
                  minPrice: params.minPrice,
                  maxPrice: params.maxPrice,
                },
              };
            }),
            catchError((error) =>
              of(
                new BrowseActions.BrowseError({
                  error,
                  errorEffect: BrowseActions.FETCH_BOOKS_APPEND,
                })
              )
            )
          );
      }
    )
  );

  @Effect()
  fetchBooksCount = this.actions$.pipe(
    ofType(BrowseActions.FETCH_BOOKS_COUNT),
    map((action: BrowseActions.FetchBooksCount) => {
      return action.payload;
    }),
    switchMap(
      (params: {
        category: string;
        author: string;
        minPrice: string;
        maxPrice: string;
      }) => {
        return this.bookService
          .getBooksCount(
            params.category,
            params.author,
            params.minPrice,
            params.maxPrice
          )
          .pipe(
            map((res) => {
              return {
                type: BrowseActions.FETCH_BOOKS_COUNT_SUCCESS,
                payload: {
                  res,
                  effect: BrowseActions.FETCH_BOOKS_COUNT,
                },
              };
            }),
            catchError((error) =>
              of(
                new BrowseActions.BrowseError({
                  error,
                  errorEffect: BrowseActions.FETCH_BOOKS_COUNT,
                })
              )
            )
          );
      }
    )
  );

  @Effect()
  fetchCategory = this.actions$.pipe(
    ofType(BrowseActions.FETCH_CATEGORY),
    switchMap((action: BrowseActions.FetchCategory) => {
      return this.bookService.getCategory().pipe(
        map((res) => {
          return {
            type: BrowseActions.FETCH_CATEGORY_SUCCESS,
            payload: { res, effect: BrowseActions.FETCH_CATEGORY },
          };
        }),
        catchError((error) =>
          of(
            new BrowseActions.BrowseError({
              error,
              errorEffect: BrowseActions.FETCH_CATEGORY,
            })
          )
        )
      );
    })
  );

  @Effect()
  fetchAuthor = this.actions$.pipe(
    ofType(BrowseActions.FETCH_AUTHORS),
    switchMap((action: BrowseActions.FetchAuthors) => {
      return this.bookService.getAuthors().pipe(
        map((res) => {
          return {
            type: BrowseActions.FETCH_AUTHORS_SUCCESS,
            payload: { res, effect: BrowseActions.FETCH_AUTHORS },
          };
        }),
        catchError((error) =>
          of(
            new BrowseActions.BrowseError({
              error,
              errorEffect: BrowseActions.FETCH_AUTHORS,
            })
          )
        )
      );
    })
  );

  constructor(private actions$: Actions, private bookService: BookService) {}
}
