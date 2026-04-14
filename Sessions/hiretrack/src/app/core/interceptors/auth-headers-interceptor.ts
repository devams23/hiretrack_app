import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);  
  if(!authService.isTokenValid()){
    authService.signOut();
    //console.log('TOKEN IS EXPIRED...');
    
    //return next(req);
  }

  const token = environment.SUPABASE_ANON_KEY;
  const authToken = localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser')!).accessToken
    : token;

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        apiKey: token,
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation' 
      },
    });
    // if (req.method === 'POST') {
    //   clonedReq.headers.set('Prefer', 'return=representation');
    // }
    return next(clonedReq);
  }

  return next(req);
};
