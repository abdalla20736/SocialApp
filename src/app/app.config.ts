import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideTimeago, TimeagoFormatter } from 'ngx-timeago';
import { ShortTimeagoFormatter } from './shared/formatters/short-timeago.formatter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor, authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({ anchorScrolling: 'enabled' }),
    ),
    provideTimeago({
      formatter: {
        provide: TimeagoFormatter,
        useClass: ShortTimeagoFormatter,
      },
    }),
    provideToastr({ timeOut: 3000, progressAnimation: 'decreasing', progressBar: true }),
  ],
};
