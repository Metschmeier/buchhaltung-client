import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';

import { App } from './app/app';
import { appRoutes } from './app/app.routes';
import { httpLoadingInterceptor } from './app/core/interceptors/loading.interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([httpLoadingInterceptor])
    ),
    provideRouter(appRoutes),

    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot()
    )
  ]
});