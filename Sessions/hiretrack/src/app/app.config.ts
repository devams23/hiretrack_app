import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authHeadersInterceptor } from './core/interceptors/auth-headers-interceptor';
import { globalErrorHandlerInterceptor } from './core/interceptors/global-error-handler-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(

      withInterceptors([
        authHeadersInterceptor,
        globalErrorHandlerInterceptor
      ])
    )
]
};
