import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { AuthService } from '../../services/auth';
import { User } from '../../models/employee.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser: User | null = null;
  loading = true;
  saving = false;
  changingPassword = false;
  successMessage = '';
  errorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      contactInfo: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.loadProfile();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  loadProfile() {
    this.loading = true;
    this.errorMessage = '';
    this.employeeService.getMyProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          fullName: user.fullName,
          contactInfo: user.contactInfo ?? ''
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Could not load profile. Please refresh.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.employeeService.updateMyProfile(this.profileForm.value).subscribe({
      next: (updated: User) => {
        this.saving = false;
        this.successMessage = 'Profile updated successfully!';
        if (this.currentUser) {
          this.currentUser = { ...this.currentUser, fullName: updated.fullName ?? this.currentUser.fullName, contactInfo: updated.contactInfo ?? this.currentUser.contactInfo };
        }
        setTimeout(() => (this.successMessage = ''), 3500);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'Failed to update profile. Please try again.';
      }
    });
  }

  onChangePassword() {
    if (this.passwordForm.invalid) return;

    this.changingPassword = true;
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.employeeService.updateMyPassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.changingPassword = false;
        this.passwordSuccessMessage = 'Password updated successfully!';
        this.passwordForm.reset();
        setTimeout(() => (this.passwordSuccessMessage = ''), 4000);
      },
      error: (err) => {
        this.changingPassword = false;
        this.passwordErrorMessage = err?.error?.message || 'Failed to update password. Please check your current password.';
      }
    });
  }

  getInitial(): string {
    return this.currentUser?.fullName?.charAt(0)?.toUpperCase() || '?';
  }
}
