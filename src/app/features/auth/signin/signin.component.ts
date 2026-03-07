import { UserService } from './../../../core/services/user.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PASSWORD_PATTERN } from '../../../core/constants/validators.constant';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class Signin {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private toastrService = inject(ToastrService);
  private router = inject(Router);

  loginForm: FormGroup;

  isLoading = false;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastrService.success('Login successful!', 'Success');
          this.router.navigate(['/feed']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
          const errorMessage =
            error?.error?.message ||
            error?.message ||
            'Login failed. Please check your credentials and try again.';
          this.toastrService.error(errorMessage, 'Error');
        },
      });
    }
  }
}
