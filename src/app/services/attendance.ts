import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AttendanceSummary } from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private readonly baseUrl = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) {}

  /** POST /api/attendance/mark?status=PRESENT|ABSENT|ON_LEAVE */
  markAttendance(status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.post(`${this.baseUrl}/mark`, null, { params });
  }

  /** GET /api/attendance/my-summary?year=&month= */
  getMySummary(year: number, month: number): Observable<AttendanceSummary> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    return this.http.get<AttendanceSummary>(`${this.baseUrl}/my-summary`, { params });
  }

  /** GET /api/attendance/employee/:id/summary?year=&month= — admin/manager */
  getEmployeeSummary(id: number, year: number, month: number): Observable<AttendanceSummary> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    return this.http.get<AttendanceSummary>(`${this.baseUrl}/employee/${id}/summary`, { params });
  }
}
