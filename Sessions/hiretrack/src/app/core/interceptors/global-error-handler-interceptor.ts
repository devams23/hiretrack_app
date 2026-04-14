import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast-service';

export const globalErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.error?.msg) {
        errorMessage = error.error.msg;
      } else if (error.error?.code === 'PGRST303') {
        errorMessage = 'Unauthorized access - invalid or missing token';
        console.error(errorMessage);
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized login. Please check your credentials.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toastService.showError(errorMessage);
      
      // Here you can add additional logic to handle specific error statuses, e.g., redirect to login on 401
      return throwError(() => error);
    })
  );
};
