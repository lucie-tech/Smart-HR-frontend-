import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LeaveRequest } from '../models/leave.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private readonly baseUrl = `${environment.apiUrl}/leaves`;

  constructor(private http: HttpClient) {}

  /** POST /api/leaves/apply */
  apply(data: { type: string; startDate: string; endDate: string; reason: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply`, data);
  }

  /** GET /api/leaves/my-history */
  getMyHistory(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/my-history`);
  }

  /** GET /api/leaves/ — admin/manager */
  getAll(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/`);
  }

  /** PUT /api/leaves/:id/process?status=APPROVED|REJECTED — admin/manager */
  processLeave(id: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${this.baseUrl}/${id}/process`, null, { params });
  }
}
