import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { User } from '../../models/employee.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {
  employees: User[] = [];
  loading = true;
  searchTerm = '';

  // Edit modal state
  editingEmployee: User | null = null;
  editForm!: FormGroup;
  passwordForm!: FormGroup;
  saving = false;
  savingPassword = false;
  successMessage = '';
  errorMessage = '';
  showPasswordForm = false;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.editForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: [''],
      contactInfo: [''],
      employmentStatus: ['']
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required]
    });
  }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => { this.employees = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): User[] {
    if (!this.searchTerm.trim()) return this.employees;
    const q = this.searchTerm.toLowerCase();
    return this.employees.filter(e =>
      e.fullName?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.employeeId?.toLowerCase().includes(q) ||
      e.role?.toLowerCase().includes(q)
    );
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  openEdit(emp: User) {
    this.editingEmployee = emp;
    this.successMessage = '';
    this.errorMessage = '';
    this.showPasswordForm = false;
    this.editForm.patchValue({
      fullName: emp.fullName,
      email: emp.email,
      jobTitle: emp.jobTitle || '',
      contactInfo: emp.contactInfo || '',
      employmentStatus: emp.employmentStatus || ''
    });
    this.passwordForm.reset();
  }

  closeEdit() {
    this.editingEmployee = null;
    this.successMessage = '';
    this.errorMessage = '';
  }

  saveEdit() {
    if (this.editForm.invalid || !this.editingEmployee?.id) return;
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.employeeService.updateEmployee(this.editingEmployee.id, this.editForm.value).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Employee updated successfully!';
        this.loadEmployees();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'Failed to update employee.';
      }
    });
  }

  savePassword() {
    if (this.passwordForm.invalid || !this.editingEmployee?.id) return;
    const { password, confirm } = this.passwordForm.value;
    if (password !== confirm) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.savingPassword = true;
    this.errorMessage = '';

    this.employeeService.updateEmployeePassword(this.editingEmployee.id, password).subscribe({
      next: () => {
        this.savingPassword = false;
        this.successMessage = 'Password updated successfully!';
        this.showPasswordForm = false;
        this.passwordForm.reset();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        this.savingPassword = false;
        this.errorMessage = err?.error?.message || 'Failed to update password.';
      }
    });
  }

  deleteEmployee(emp: User) {
    if (!emp.id) return;
    if (!confirm(`Are you sure you want to delete "${emp.fullName}"? This cannot be undone.`)) return;

    this.employeeService.deleteEmployee(emp.id).subscribe({
      next: () => { this.loadEmployees(); },
      error: (err) => { alert(err?.error?.message || 'Failed to delete employee.'); }
    });
  }

  getRoleLabel(role?: string): string {
    const map: Record<string, string> = {
      ROLE_ADMIN: 'Admin', ROLE_HR_MANAGER: 'HR Manager',
      ROLE_DEPARTMENT_MANAGER: 'Manager', ROLE_RECRUITER: 'Recruiter',
      ROLE_EMPLOYEE: 'Employee',
    };
    return role ? (map[role] || role) : 'Employee';
  }

  getRoleBadgeClass(role?: string): string {
    const map: Record<string, string> = {
      ROLE_ADMIN: 'badge-admin', ROLE_HR_MANAGER: 'badge-hr',
      ROLE_DEPARTMENT_MANAGER: 'badge-manager', ROLE_RECRUITER: 'badge-recruiter',
      ROLE_EMPLOYEE: 'badge-employee',
    };
    return role ? (map[role] || 'badge-employee') : 'badge-employee';
  }
}
