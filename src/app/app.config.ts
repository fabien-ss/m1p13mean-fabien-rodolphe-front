import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/interceptors/auth.interceptor';
import { routes } from './app.routes';
import { provideZard } from '@/shared/core/provider/providezard';
// app.config.ts
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // ou 'enabled'
        anchorScrolling: 'enabled',
      })
    ),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideRouter(routes),
    provideZard(),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LocationStrategy, useClass: HashLocationStrategy }

  ]
};
