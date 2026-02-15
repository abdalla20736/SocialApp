import { UserService } from './../../../core/services/user.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SigninRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { switchMap, throwError } from 'rxjs';
import { FeatureCardComponent } from '../../../shared/feature-card/feature-card.component';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, ReactiveFormsModule, FeatureCardComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class Signin {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private toastrService = inject(ToastrService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
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
      this.isLoading = true;
      const userBody: SigninRequest = {
        email: this.loginForm.get('email')?.value || '',
        password: this.loginForm.get('password')?.value || '',
      };

      this.authService
        .login(userBody)
        .pipe(
          switchMap((response) => {
            if (!response.token) {
              return throwError(() => new Error('Missing token in login response'));
            }
            return this.userService.getLoggedInUser();
          }),
        )
        .subscribe({
          next: () => {
            this.toastrService.success('Login successful!', 'Success');
            this.router.navigate(['/']);
          },
          error: () => {
            this.isLoading = false;
            this.toastrService.error(
              'Login failed. Please check your credentials and try again.',
              'Error',
            );
          },
        });
    }
  }
}
