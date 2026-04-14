import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';
import { AuthRequestData } from '../../models/auth-model';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-signin-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signin-form.html',
  styleUrl: './signin-form.css',
})
export class SigninForm {

  readonly authService = inject(AuthService);
  private router = inject(Router);
  protected signInForm!: FormGroup;
  protected toastService = inject(ToastService);
  protected defaultUsers: AuthRequestData[] = [
    { email: 'myselfdevam@gmail.com', password: 'Devam@123' },
    // { email: 'user2@example.com', password: 'password123' },
    // { email: 'admin@hiretrack.com', password: 'adminpassword' }
  ];

  ngOnInit() {
    this.signInForm = this.createSignInForm();
  }

  selectDefaultUser(user: AuthRequestData) {
    this.signInForm.patchValue({
      email: user.email,
      password: user.password
    });
  }
  getError(controlName: string): string | null {
    const control = this.signInForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) return null;

    const { required, minlength, maxlength } = control.errors;
    if (required) return 'This field is required.';
    if (minlength) return `Must be at least ${minlength.requiredLength} characters.`;
    if (maxlength) return `Cannot exceed ${maxlength.requiredLength} characters.`;

    return null;
  }
  onSubmit() {
    if (this.signInForm.valid) {

      const signinData: AuthRequestData = {
        email: this.signInForm.value.email!,
        password: this.signInForm.value.password!,
      };

      this.authService.passwordSignIn(signinData).subscribe({
        next: (response) => {
          this.toastService.showSuccess('Sign-in successful');
          this.router.navigate(['/']);
        }
      });
    } else {
      this.signInForm.markAllAsTouched();
      this.toastService.showError('Form is invalid');
    }
  }

  createSignInForm(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
}
