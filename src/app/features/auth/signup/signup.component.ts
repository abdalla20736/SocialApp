import {
  Component,
  inject,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { SignupRequest } from '../../../core/models/auth/auth.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { debounce, debounceTime, finalize, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PASSWORD_PATTERN } from '../../../core/constants/validators.constant';

type FormControls<T> = {
  [K in keyof T]: FormControl<T[K] | null>;
};

@Component({
  selector: 'app-signup',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class Signup implements OnInit {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private toastrService = inject(ToastrService);

  registerForm: FormGroup<FormControls<SignupRequest>>;
  isLoading = false;
  @Output() layoutHeader = new EventEmitter<string>();
  @Output() layoutSubHeader = new EventEmitter<string>();

  constructor() {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
        rePassword: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required, this.dateValidator]],
        gender: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    ) as FormGroup<FormControls<SignupRequest>>;
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const password: string = group.get('password')?.value;
    const rePassword: string = group.get('rePassword')?.value;
    return password === rePassword ? null : { passwordMismatch: true };
  }

  private dateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const date = new Date(value);
    const today = new Date();
    const minAge = 18;
    const maxAge = 120;

    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    if (date > today) {
      return { futureDate: true };
    }

    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (actualAge < minAge) {
      return { minAge: { requiredAge: minAge, actualAge } };
    }

    if (actualAge > maxAge) {
      return { maxAge: { requiredAge: maxAge, actualAge } };
    }

    return null;
  }

  ngOnInit() {}

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.registerForm.get('dateOfBirth')?.setValue(input.value);
    this.registerForm.get('dateOfBirth')?.markAsTouched();
  }

  openDatePicker(): void {
    const input = document.getElementById('dateOfBirth') as HTMLInputElement;
    if (input) {
      input.focus();
      input.click();
    }
  }

  onSubmit(): void {
    const registeredUser = this.registerForm.value;
    const userData: SignupRequest = {
      name: registeredUser.name || '',
      email: registeredUser.email || '',
      password: registeredUser.password || '',
      rePassword: registeredUser.rePassword || '',
      dateOfBirth: registeredUser.dateOfBirth || '',
      gender: registeredUser.gender || '',
    };

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService
        .register(userData)
        .pipe(
          debounceTime(500),
          finalize(() => (this.isLoading = false)),
        )
        .subscribe({
          next: () => {
            this.toastrService.success('Registration successful!', 'Success');
            this.router.navigate(['/login']);
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 409) {
              this.toastrService.warning(
                'This email is already registered. Please sign in.',
                'Conflict',
              );
              return;
            }

            this.toastrService.error('Registration failed. Please try again.', 'Error');
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
