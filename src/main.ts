import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import './polyfills.ts';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { environment } from './enviroments/enviroment.prod';
registerLocaleData(localePt);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
