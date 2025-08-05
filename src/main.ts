import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { App } from './app/app';
import { appRoutes } from './app/app.routes';
import { httpLoadingInterceptor } from './app/core/interceptors/loading.interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([httpLoadingInterceptor]),
      withInterceptorsFromDi()
    ),
    provideRouter(appRoutes),
  ],
});