import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { PASSWORD_PATTERN } from '../../../core/constants/validators.constant';
import { ChangePasswordPayload } from '../../../core/models/auth/change-password.model';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePassword {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);

  isLoading: boolean = false;
  successMessage: boolean = false;

  changePasswordForm = this.formBuilder.group(
    {
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
      confirmNewPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatchValidator },
  );

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const newPassword: string = group.get('newPassword')?.value;
    const confirmNewPassword: string = group.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      const changePasswordData: ChangePasswordPayload = {
        password: this.changePasswordForm.value.password!,
        newPassword: this.changePasswordForm.value.newPassword!,
      };
      this.authService.changePassword(changePasswordData).subscribe({
        next: () => {
          this.changePasswordForm.reset();
          this.isLoading = false;
          this.successMessage = true;
        },
        error: (err) => {
          console.error('Failed to change password:', err);
          this.isLoading = false;
        },
      });
    }
  }
}
