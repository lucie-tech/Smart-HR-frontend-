import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave';
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
  loading = false;
  submitting = false;
  showForm = false;

  constructor(
    private leaveService: LeaveService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadHistory();
  }

  initForm() {
    this.leaveForm = this.formBuilder.group({
      type: ['ANNUAL', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  loadHistory() {
    this.loading = true;
    this.leaveService.getMyHistory().subscribe({
      next: (data) => {
        // Sort by applied date descending
        this.leaves = data.sort((a, b) => {
          return new Date(b.appliedAt || '').getTime() - new Date(a.appliedAt || '').getTime();
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.leaveForm.reset({ type: 'ANNUAL' });
    }
  }

  onSubmit() {
    if (this.leaveForm.invalid) return;

    this.submitting = true;
    this.leaveService.apply(this.leaveForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.toggleForm();
        this.loadHistory();
      },
      error: (err) => {
        alert('Failed to apply for leave: ' + (err.error?.message || 'Unknown error'));
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
