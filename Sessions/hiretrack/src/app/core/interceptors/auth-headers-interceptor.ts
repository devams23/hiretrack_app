import { HttpInterceptorFn } from '@angular/common/http';
import { devenvironment } from '../../../environments/environment.development';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
    const currentTime = Math.floor(Date.now() / 1000);
  
  if (localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')!).expiresAt < currentTime) {
    console.warn('Access token has expired. Please log in again.');
    authService.signOut();
  }

  const token = devenvironment.supabaseAnonKey;
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
