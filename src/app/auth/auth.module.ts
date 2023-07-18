import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { RouterModule } from '@angular/router';
import { AuthRoutes } from './auth.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    ReactiveFormsModule,
    NgbModule,
    AngularFireAuthModule,
    SocialLoginModule,
    NgbToastModule
  ],
  declarations: [SigninComponent, SignupComponent, ForgotPasswordComponent],
  exports: [SigninComponent, SignupComponent, ForgotPasswordComponent],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('186730369443-t65ij8igqirdcrlrnp6hmtaq9u7bg77m.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
})
export class AuthModule {}
