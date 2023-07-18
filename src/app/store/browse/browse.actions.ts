import { Action } from '@ngrx/store';
import { HttpError } from '../app.reducers';
import { BookResponse, BookCategory, Author } from '../model';

export const FETCH_BOOKS = 'FETCH_BOOKS';
export const FETCH_BOOKS_SUCCESS = 'FETCH_BOOKS_SUCCESS';
export const FETCH_BOOKS_APPEND = 'FETCH_BOOKS_APPEND';
export const FETCH_BOOKS_APPEND_SUCCESS = 'FETCH_BOOKS_APPEND_SUCCESS';
export const FETCH_BOOKS_COUNT = 'FETCH_BOOKS_COUNT';
export const FETCH_BOOKS_COUNT_SUCCESS = 'FETCH_BOOKS_COUNT_SUCCESS';
export const FETCH_CATEGORY = 'FETCH_CATEGORY';
export const FETCH_CATEGORY_SUCCESS = 'FETCH_CATEGORY_SUCCESS';
export const FETCH_AUTHORS = 'FETCH_AUTHORS';
export const FETCH_AUTHORS_SUCCESS = 'FETCH_AUTHORS_SUCCESS';
export const BROWSE_ERROR = 'BROWSE_ERROR';


export class FetchBooks implements Action {
  readonly type = FETCH_BOOKS;

  constructor(public payload: { page: number, sort: string, category: string, author: string, minPrice: string, maxPrice: string }) {
  }
}

export class FetchBooksSuccess implements Action {
  readonly type = FETCH_BOOKS_SUCCESS;

  constructor(public payload: { res: Array<BookResponse>, effect: string, selectedPage: number, selectedSort: string, selectedCategory: string, selectedAuthor: string, minPrice: string, maxPrice: string }) {
  }
}

export class FetchBooksAppend implements Action {
  readonly type = FETCH_BOOKS_APPEND;

  constructor(public payload: { page: number, sort: string, category: string, author: string, minPrice: string, maxPrice: string }) {
  }
}

export class FetchBookAppendSuccess implements Action {
  readonly type = FETCH_BOOKS_APPEND_SUCCESS;

  constructor(public payload: { res: Array<BookResponse>, effect: string, selectedPage: number, selectedSort: string, selectedCategory: string, selectedAuthor: string, minPrice: string, maxPrice: string }) {
  }
}

export class FetchBooksCount implements Action {
  readonly type = FETCH_BOOKS_COUNT;

  constructor(public payload: { category: string, author: string, minPrice: string, maxPrice: string }) {
  }
}

export class FetchBooksCountSuccess implements Action {
  readonly type = FETCH_BOOKS_COUNT_SUCCESS;

  constructor(public payload: { res: number, effect: string }) {
  }
}

export class FetchCategory implements Action {
  readonly type = FETCH_CATEGORY;
}

export class FetchCategorySuccess implements Action {
  readonly type = FETCH_CATEGORY_SUCCESS;

  constructor(public payload: { res: Array<BookCategory>, effect: string }) {
  }
}


export class FetchAuthors implements Action {
  readonly type = FETCH_AUTHORS;
}

export class FetchAuthorsSuccess implements Action {
  readonly type = FETCH_AUTHORS_SUCCESS;

  constructor(public payload: { res: Array<Author>, effect: string }) {
  }
}


export class BrowseError implements Action {
  readonly type = BROWSE_ERROR;

  constructor(public payload: HttpError) {
  }
}


export type BrowseActions = FetchBooks | FetchBooksSuccess |
  FetchBooksAppend | FetchBookAppendSuccess |
  FetchBooksCount | FetchBooksCountSuccess |
  FetchCategory | FetchCategorySuccess |
  FetchAuthors | FetchAuthorsSuccess | BrowseError;
