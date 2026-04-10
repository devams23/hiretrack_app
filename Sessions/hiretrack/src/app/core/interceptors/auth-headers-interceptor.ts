import { HttpInterceptorFn } from '@angular/common/http';
import { devenvironment } from '../../../environments/environment.development';

export const authHeadersInterceptor: HttpInterceptorFn = (req, next) => {

  const token = devenvironment.supabaseAnonKey;
  const authToken = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).accessToken : token;
  
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        'apiKey': token,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
