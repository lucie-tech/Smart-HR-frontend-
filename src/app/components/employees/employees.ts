import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee';
import { User } from '../../models/employee.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {
  employees: User[] = [];
  loading = true;
  searchTerm = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
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

  getRoleLabel(role?: string): string {
    const map: Record<string, string> = {
      ROLE_ADMIN: 'Admin',
      ROLE_HR_MANAGER: 'HR Manager',
      ROLE_DEPARTMENT_MANAGER: 'Manager',
      ROLE_RECRUITER: 'Recruiter',
      ROLE_EMPLOYEE: 'Employee',
    };
    return role ? (map[role] || role) : 'Employee';
  }

  getRoleBadgeClass(role?: string): string {
    const map: Record<string, string> = {
      ROLE_ADMIN: 'badge-admin',
      ROLE_HR_MANAGER: 'badge-hr',
      ROLE_DEPARTMENT_MANAGER: 'badge-manager',
      ROLE_RECRUITER: 'badge-recruiter',
      ROLE_EMPLOYEE: 'badge-employee',
    };
    return role ? (map[role] || 'badge-employee') : 'badge-employee';
  }
}
