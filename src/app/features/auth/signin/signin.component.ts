import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SigninRequest, User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signin',
  imports: [RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class Signin {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const userBody: SigninRequest = {
        email: this.loginForm.get('email')?.value || '',
        password: this.loginForm.get('password')?.value || '',
      };

      this.authService.login(userBody).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/timeline']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
    }
  }
}
