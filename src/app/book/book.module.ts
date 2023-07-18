import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './book.component';
import { RouterModule } from '@angular/router';
import { BookRoutes } from './book.routes';
import { RelatedComponent } from './related/related.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BookRoutes),
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [BookComponent, RelatedComponent],
  providers: []
})
export class BookModule {
}
