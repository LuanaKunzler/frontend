import { Routes } from '@angular/router';
import { BookComponent } from './book.component';


export const BookRoutes: Routes = [
  { path: 'book/:bookUrl', component: BookComponent }
];

