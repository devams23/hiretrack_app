import { inject, Injectable, signal } from '@angular/core';
import { devenvironment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthRequestData } from '../../features/auth/models/auth-model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserModel } from '../models/user-model';
import { Router } from '@angular/router';
import { SupabaseSignInResponse, SupabaseSignUpResponse } from '../models/supabase-auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = devenvironment.supabaseUrl + '/auth/v1';

  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private router = inject(Router);
  isAuthenticated = signal<boolean>(false);
  private http = inject(HttpClient);

  passwordSignUp(signupRequestData: AuthRequestData) {
    return this.http.post<SupabaseSignUpResponse>(`${this.authUrl}/signup`, signupRequestData).pipe(
      tap(() => {
        this.router.navigate(['/auth/signin']);
      }),
    );
  }

  passwordSignIn(signinRequestData: AuthRequestData): Observable<SupabaseSignInResponse> {
    return this.http
      .post<SupabaseSignInResponse>(`${this.authUrl}/jlsjlksjdla/token?grant_type=password`, signinRequestData)
      .pipe(
        tap((response) => {
          this.handleLoginSuccess(response);
        }),
      );
  }

  signOut() {
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/signin']);
  }
  /*
  Handles the successful login response ,
  converts it to UserModel and updates the current user */
  handleLoginSuccess(response: SupabaseSignInResponse) {
    const userData: UserModel = {
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      expiresAt: response.expires_at,
      refreshToken: response.refresh_token,
      userEmail: response.user.email,
    };

    this.currentUserSubject.next(userData);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }
}
