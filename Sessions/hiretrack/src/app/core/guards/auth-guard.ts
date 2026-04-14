import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);

  if (authService.isAuthenticated() && authService.isTokenValid()) {
    //console.log("TOKEN IS VALID... IN GUARD")
    return true;
  } else {
    authService.signOut();
    //console.log("TOKEN IS EXPIRED... IN GUARD")
    return false;
  }
};
