import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8888/auth/login';
  private registerApiUrl = 'http://localhost:8888/auth/register';

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedIn.asObservable();

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.loggedIn.next(true);
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(this.registerApiUrl, user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
