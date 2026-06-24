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
  currentUser: User | null = null;
  loading = true;
  saving = false;
  uploadingPhoto = false;
  successMessage = '';
  errorMessage = '';
  photoPreview: string | null = null;

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
    this.loadProfile();
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
        if (user.profilePhotoUrl) {
          this.photoPreview = user.profilePhotoUrl;
        }
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
      next: (updated) => {
        this.saving = false;
        this.successMessage = 'Profile updated successfully!';
        if (this.currentUser) {
          this.currentUser = { ...this.currentUser, ...this.profileForm.value };
        }
        setTimeout(() => (this.successMessage = ''), 3500);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'Failed to update profile. Please try again.';
      }
    });
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];

    // Preview instantly
    const reader = new FileReader();
    reader.onload = () => (this.photoPreview = reader.result as string);
    reader.readAsDataURL(file);

    this.uploadingPhoto = true;
    this.employeeService.uploadPhoto(file).subscribe({
      next: (res: any) => {
        this.uploadingPhoto = false;
        this.successMessage = 'Photo uploaded!';
        if (this.currentUser && res?.profilePhotoUrl) {
          this.currentUser.profilePhotoUrl = res.profilePhotoUrl;
          this.photoPreview = res.profilePhotoUrl;
        }
        setTimeout(() => (this.successMessage = ''), 3500);
      },
      error: () => {
        this.uploadingPhoto = false;
        this.errorMessage = 'Photo upload failed. Please try again.';
      }
    });
  }

  getInitial(): string {
    return this.currentUser?.fullName?.charAt(0)?.toUpperCase() || '?';
  }
}
