import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave';
import { AuthService } from '../../services/auth';
import { LeaveRequest } from '../../models/leave.model';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave.html',
  styleUrls: ['./leave.css']
})
export class LeaveComponent implements OnInit {
  leaves: LeaveRequest[] = [];
  leaveForm!: FormGroup;
  editLeaveForm!: FormGroup;
  loading = false;
  submitting = false;
  showForm = false;
  processing: number | null = null;
  successMessage = '';
  errorMessage = '';

  selectedLeave: LeaveRequest | null = null;
  isEditing = false;

  constructor(
    private leaveService: LeaveService,
    private formBuilder: FormBuilder,
    public authService: AuthService
  ) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit() {
    this.initForm();
    this.loadLeaves();
  }

  initForm() {
    this.leaveForm = this.formBuilder.group({
      type: ['ANNUAL', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });

    this.editLeaveForm = this.formBuilder.group({
      type: ['ANNUAL', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  loadLeaves() {
    this.loading = true;
    const obs = this.isAdmin ? this.leaveService.getAll() : this.leaveService.getMyHistory();
    obs.subscribe({
      next: (data) => {
        this.leaves = data.sort((a, b) =>
          new Date(b.appliedAt || '').getTime() - new Date(a.appliedAt || '').getTime()
        );
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.leaveForm.reset({ type: 'ANNUAL' });
  }

  onSubmit() {
    if (this.leaveForm.invalid) return;
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.leaveService.apply(this.leaveForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Leave application submitted successfully!';
        this.toggleForm();
        this.loadLeaves();
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to apply for leave. Please try again.';
        this.submitting = false;
      }
    });
  }

  processLeave(id: number, status: 'APPROVED' | 'REJECTED') {
    this.processing = id;
    this.leaveService.processLeave(id, status).subscribe({
      next: () => {
        this.processing = null;
        this.loadLeaves();
      },
      error: () => { this.processing = null; }
    });
  }

  openDetails(leave: LeaveRequest) {
    this.selectedLeave = leave;
    this.isEditing = false;
  }

  closeDetails() {
    this.selectedLeave = null;
    this.isEditing = false;
  }

  startEdit() {
    if (!this.selectedLeave) return;
    this.isEditing = true;
    this.editLeaveForm.patchValue({
      type: this.selectedLeave.type,
      startDate: this.selectedLeave.startDate,
      endDate: this.selectedLeave.endDate,
      reason: this.selectedLeave.reason || ''
    });
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveEdit() {
    if (this.editLeaveForm.invalid || !this.selectedLeave?.id) return;
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.leaveService.update(this.selectedLeave.id, this.editLeaveForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Leave request updated successfully!';
        this.closeDetails();
        this.loadLeaves();
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update leave request.';
        this.submitting = false;
      }
    });
  }

  deleteLeave(id: number) {
    if (!confirm('Are you sure you want to delete/cancel this leave request?')) return;
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.leaveService.delete(id).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Leave request deleted successfully!';
        this.closeDetails();
        this.loadLeaves();
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to delete leave request.';
        this.submitting = false;
      }
    });
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'APPROVED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      case 'PENDING': return 'badge-warning';
      default: return 'badge-info';
    }
  }
}
