import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FaqComponent } from './faq.component';
import { FaqRoutes } from './faq.routes';
import { AccordionModule } from 'ngx-bootstrap/accordion';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FaqRoutes),
    NgbModule,
    AccordionModule.forRoot()
  ],
  declarations: [FaqComponent]
})
export class FaqModule {
}
