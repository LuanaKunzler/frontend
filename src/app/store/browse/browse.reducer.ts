import * as BrowseActions from './browse.actions';
import { HttpError } from '../app.reducers';
import { BookCategory, BookResponse, Author } from '../model';


export interface BrowseState {
  books: Array<BookResponse>;
  booksCount: number;
  categories: Array<BookCategory>;
  authors: Array<Author>;
  canFetch: boolean;
  selectedPage: number;
  selectedSort: string;
  selectedCategory: string;
  selectedAuthor: string;
  minPrice: string;
  maxPrice: string;
  errors: Array<HttpError>;
  loading: boolean;
}

const initialState: BrowseState = {
  books: [],
  booksCount: 0,
  authors: [],
  categories: [],
  canFetch: true,
  selectedPage: 0,
  selectedSort: 'any',
  selectedCategory: 'any',
  selectedAuthor: 'any',
  minPrice: '0',
  maxPrice: '0',
  errors: [],
  loading: false
};

export function browseReducer(state = initialState, action: BrowseActions.BrowseActions) {
  switch (action.type) {
    case (BrowseActions.FETCH_BOOKS_APPEND):
    case (BrowseActions.FETCH_BOOKS):
      return {
        ...state,
        loading: true
      };

    case (BrowseActions.FETCH_BOOKS_SUCCESS):
      return {
        ...state,
        selectedPage: action.payload.selectedPage,
        selectedSort: action.payload.selectedSort,
        selectedCategory: action.payload.selectedCategory,
        selectedAuthor: action.payload.selectedAuthor,
        minPrice: action.payload.minPrice,
        maxPrice: action.payload.maxPrice,
        books: action.payload.res,
        canFetch: action.payload.res.length !== 0,
        errors: [...state.errors.filter(error => error.errorEffect !== action.payload.effect)],
        loading: false
      };

    case (BrowseActions.FETCH_BOOKS_APPEND_SUCCESS):
      return {
        ...state,
        selectedPage: action.payload.selectedPage,
        selectedSort: action.payload.selectedSort,
        selectedCategory: action.payload.selectedCategory,
        selectedAuthor: action.payload.selectedAuthor,
        minPrice: action.payload.minPrice,
        maxPrice: action.payload.maxPrice,
        books: [...state.books, ...action.payload.res],
        canFetch: action.payload.res.length !== 0,
        errors: [...state.errors.filter(error => error.errorEffect !== action.payload.effect)],
        loading: false
      };

    case (BrowseActions.FETCH_BOOKS_COUNT_SUCCESS):
      return {
        ...state,
        booksCount: action.payload.res,
        errors: [...state.errors.filter(error => error.errorEffect !== action.payload.effect)]
      };

    case (BrowseActions.FETCH_CATEGORY_SUCCESS):
      return {
        ...state,
        categories: action.payload.res,
        errors: [...state.errors.filter(error => error.errorEffect !== action.payload.effect)]
      };

    case (BrowseActions.FETCH_AUTHORS_SUCCESS):
      return {
        ...state,
        authors: action.payload.res,
        errors: [...state.errors.filter(error => error.errorEffect !== action.payload.effect)]
      };

    case (BrowseActions.BROWSE_ERROR):
      const errors = [...state.errors];
      const index = errors.findIndex(error => error.errorEffect === action.payload.errorEffect);
      if (index !== -1) {
        errors[index] = action.payload;
      } else {
        errors.push(action.payload);
      }
      return {
        ...state,
        loading: false,
        errors
      };

    default:
      return state;
  }
}
