import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';
import { AuthRequestData } from '../../models/auth-model';

@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm {
  readonly authService = inject(AuthService);
onSubmit() {

  if (this.signupForm.valid) {
    const signupData: AuthRequestData = {
      email: this.signupForm.value.email!,
      password: this.signupForm.value.password!,
    };
    this.authService.passwordSignUp(signupData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
      },
      error: (error) => {
        console.error('Signup failed:', error);
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
