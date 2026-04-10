import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';
import { AuthRequestData } from '../../models/auth-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signin-form.html',
  styleUrl: './signin-form.css',
})
export class SigninForm {

  readonly authService = inject(AuthService);
  private router = inject(Router);
  protected signInForm!: FormGroup;



  ngOnInit() {
    this.signInForm = this.createSignInForm();
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const signinData: AuthRequestData = {
        email: this.signInForm.value.email!,
        password: this.signInForm.value.password!,
      };

      this.authService.passwordSignIn(signinData).subscribe({
        next: (response) => {
          console.log('Sign-in successful:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Sign-in failed:', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  createSignInForm(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
}
