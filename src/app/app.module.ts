import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';
import { FooterModule } from './footer/footer.module';
import { PreloadAllModules, RouterModule } from '@angular/router';
import AppRoutes from './app.routes';
import { GPageNotFoundComponent } from './g-page-not-found/g-page-not-found.component';
import { BrowseModule } from './browse/browse.module';
import { BookModule } from './book/book.module';
import { SearchModule } from './search/search.module';
import { BookService } from './services/book.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/app.reducers';
import { CartEffects } from './store/cart/cart.effects';
import { OrderEffects } from './store/order/order.effects';
import { CartService } from './services/cart.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from './services/order.service';
import { TokenService } from './services/token.service';
import { AuthEffects } from './store/authorization/authorization.effects';
import { TokenInterceptor } from './services/token.interceptor';
import { AuthGuardService } from './services/auth-guard.service';
import { ShowcaseEffects } from './store/showcase/showcase.effects';
import { AccountService } from './services/account.service';
import { BrowseEffects } from './store/browse/browse.effects';
import { VerificationModule } from './verification/verification.module';
import { NonAuthGuardService } from './services/non-auth-guard.service';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../enviroments/enviroment';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminModule } from './admin/admin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AdminAuthGuard } from './services/admin-guard.service';
import { UsersService } from './services/admin-services/users.service';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    GPageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HeaderModule,
    HomeModule,
    BrowseModule,
    BookModule,
    VerificationModule,
    SearchModule,
    AuthModule,
    FooterModule,
    HttpClientModule,
    NgbModule,
    SocialLoginModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([CartEffects, OrderEffects, AuthEffects, ShowcaseEffects, BrowseEffects]),
    RouterModule.forRoot(AppRoutes, { useHash: false, preloadingStrategy: PreloadAllModules }),
    AngularFireModule.initializeApp(environment.firebase),
    NgbToastModule,
    AccordionModule.forRoot(),
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    AdminModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    NgxMaskModule.forRoot()
  ],
  providers: [AdminAuthGuard, BookService, CartService, OrderService, TokenService, AuthGuardService, NonAuthGuardService, AccountService, UsersService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
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
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
