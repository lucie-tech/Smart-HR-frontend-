import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Announcement } from '../models/announcement.model';

export interface AnnouncementPage {
  content: Announcement[];
  totalPages: number;
  totalElements: number;
  number: number;  // current page (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private readonly baseUrl = `${environment.apiUrl}/announcements`;

  constructor(private http: HttpClient) {}

  /** GET /api/announcements?page=0&size=6 */
  getAll(page = 0, size = 6): Observable<AnnouncementPage> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<AnnouncementPage>(this.baseUrl, { params });
  }

  /** POST /api/announcements */
  create(announcement: { title: string; content: string }): Observable<Announcement> {
    return this.http.post<Announcement>(this.baseUrl, announcement);
  }

  /** PUT /api/announcements/:id */
  update(id: number, announcement: { title: string; content: string }): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.baseUrl}/${id}`, announcement);
  }

  /** DELETE /api/announcements/:id */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /** POST /api/announcements/:id/replies */
  addReply(id: number, content: string): Observable<Announcement> {
    return this.http.post<Announcement>(`${this.baseUrl}/${id}/replies`, { content });
  }
}
