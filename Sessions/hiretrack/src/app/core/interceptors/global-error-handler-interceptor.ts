import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const globalErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    // tap({
    //   error: (error: HttpErrorResponse) => {
    //     console.error('HTTP Error:', error);
    //   }
    // }),
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);
      if(error.error.code === 'PGRST303'){
        
        console.error('Unauthorized access - invalid or missing token');

      }
      // Here you can add additional logic to handle specific error statuses, e.g., redirect to login on 401
      return throwError(() => error);
    })
  );
};
