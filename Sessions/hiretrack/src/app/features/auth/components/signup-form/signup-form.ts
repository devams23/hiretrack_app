import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';
import { AuthRequestData } from '../../models/auth-model';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm {
  readonly authService = inject(AuthService);
  protected toastService = inject(ToastService);

  onSubmit() {
    if (this.signupForm.valid) {
      const signupData: AuthRequestData = {
        email: this.signupForm.value.email!,
        password: this.signupForm.value.password!,
      };
      this.authService.passwordSignUp(signupData).subscribe({
        next: (response) => {
          this.toastService.showSuccess('Signup successful');
        },
        error: (error) => {
          this.toastService.showError('Signup failed');
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  readonly signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
}
