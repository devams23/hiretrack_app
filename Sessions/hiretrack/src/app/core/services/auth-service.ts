import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthRequestData } from '../../features/auth/models/auth-model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserModel } from '../models/hire-track-app/user-model';
import { Router } from '@angular/router';
import { SupabaseSignInResponse, SupabaseSignUpResponse } from '../models/supabase-auth';
//import { createLinkedSignal } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = environment.supabaseUrl + '/auth/v1';
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private router = inject(Router);
  isAuthenticated = signal<boolean>(false);
  private http = inject(HttpClient);

  constructor() {
this.autoLogin();

  }
  passwordSignUp(signupRequestData: AuthRequestData) {
    return this.http.post<SupabaseSignUpResponse>(`${this.authUrl}/signup`, signupRequestData).pipe(
      tap(() => {
        this.router.navigate(['/auth/signin']);
      }),
    );
  }

  passwordSignIn(signinRequestData: AuthRequestData): Observable<SupabaseSignInResponse> {
    return this.http
      .post<SupabaseSignInResponse>(`${this.authUrl}/token?grant_type=password`, signinRequestData)
      .pipe(
        tap((response) => {
          this.handleLoginSuccess(response);
        }),
      );
  }

  signOut() {
    console.log("SIGNING OUT...");
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/signin']);
  }

  /*
  Handles the successful login response ,
  converts it to UserModel and updates the current user */
  handleLoginSuccess(response: SupabaseSignInResponse) {
    console.log("LOGIN SUCCESS...")
    const userData: UserModel = {
      userId: response.user.id,
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      expiresAt: response.expires_at,
      refreshToken: response.refresh_token,
      userEmail: response.user.email,
    };

    this.currentUserSubject.next(userData);
    this.isAuthenticated.set(true);
    console.log("ADDING USER DATA IN LOCAL STORAGE..")
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }

  getCurrentUser(): UserModel | null {
    return this.currentUserSubject.value;
  }
  autoLogin() {
    const storedUser = localStorage.getItem('currentUser') || "";
    if (storedUser && this.isTokenValid()) {
      console.log("USER IS LOGGED IN...")
      const userData: UserModel = JSON.parse(storedUser);
      this.currentUserSubject.next(userData);
      this.isAuthenticated.set(true);
    }
    else{
      this.signOut();
    }
  }

  isTokenValid():boolean{
    const storedUser = localStorage.getItem('currentUser') ?? "";
    if(storedUser){
      const userData: UserModel = JSON.parse(storedUser);
      const now = Math.floor(new Date().getTime()/1000);
      console.log("NOW--" , now )
      console.log("EXPIRES AT--" , userData.expiresAt);
      
      return now < userData.expiresAt;
    }
    return false;
  }
}
