import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VerificationRoutes } from './verification.routes';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { PasswordForgotVerificationComponent } from './password-forgot-verification/password-forgot-verification.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VerificationRoutes),
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [EmailVerificationComponent, PasswordForgotVerificationComponent]
})
export class VerificationModule {
}
