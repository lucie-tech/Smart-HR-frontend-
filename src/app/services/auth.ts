import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface JwtResponse {
  token: string;
  id: number;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.baseUrl}/signin`, { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('access_token', res.token);
          localStorage.setItem('user_role', res.role);
          localStorage.setItem('user_email', res.email);
          localStorage.setItem('user_id', String(res.id));
        })
      );
  }

  signup(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ROLE_ADMIN' || role === 'ROLE_HR_MANAGER';
  }

  isManager(): boolean {
    const role = this.getRole();
    return role === 'ROLE_ADMIN' || role === 'ROLE_HR_MANAGER' || role === 'ROLE_DEPARTMENT_MANAGER';
  }
}
