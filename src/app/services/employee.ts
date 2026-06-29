import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly baseUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  /** GET /api/employees/me */
  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  /** PUT /api/employees/me */
  updateMyProfile(data: Partial<User>): Observable<any> {
    return this.http.put(`${this.baseUrl}/me`, data);
  }

  /** POST /api/employees/me/photo */
  uploadPhoto(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post(`${this.baseUrl}/me/photo`, fd);
  }

  /** GET /api/employees/ — admin/HR */
  getAllEmployees(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/`);
  }

  /** POST /api/employees/ — admin/HR/Recruiter */
  addEmployee(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, user);
  }

  /** PUT /api/employees/:id — admin/HR */
  updateEmployee(id: number, data: Partial<User>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  /** PUT /api/employees/:id/password — admin/HR */
  updateEmployeePassword(id: number, password: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/password`, { password });
  }

  /** DELETE /api/employees/:id — admin/HR */
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
