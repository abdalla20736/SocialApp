import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { debounce, debounceTime, finalize, tap } from 'rxjs';

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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class Signup implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userForm: FormGroup<FormControls<User>>;
  isLoading = false;

  constructor() {
    this.userForm = new FormGroup<FormControls<User>>(
      {
        email: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.email,
        ]),
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ]),
        rePassword: new FormControl('', [Validators.required]),
        dateOfBirth: new FormControl('', [Validators.required, this.dateValidator]),
        gender: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator },
    );
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

  ngOnInit() {
    initFlowbite();
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.userForm.get('dateOfBirth')?.setValue(input.value);
    this.userForm.get('dateOfBirth')?.markAsTouched();
  }

  onSubmit(): void {
    const user = this.userForm.value;
    const userData: User = {
      name: user.name || '',
      email: user.email || '',
      password: user.password || '',
      rePassword: user.rePassword || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
    };

    if (this.userForm.valid) {
      this.isLoading = true;
      this.authService
        .register(userData)
        .pipe(
          debounceTime(500),
          finalize(() => (this.isLoading = false)),
        )
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.router.navigate(['/signin']);
          },
          error: (error) => {
            console.error('Registration failed:', error);
          },
        });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
