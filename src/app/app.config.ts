import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { ApiConfiguration } from './api/api/api-configuration';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptor])),
    {
      provide: ApiConfiguration,
      useFactory: () => {
        const configuration = new ApiConfiguration();
        configuration.rootUrl = environment.apiUrl;
        return configuration;
      }
    },
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners()
  ]
};
