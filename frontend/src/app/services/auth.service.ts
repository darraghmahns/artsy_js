import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

export interface FavoriteEntry {
  artistId: string;
  addedAt: string;
}

export interface User {
  fullname: string;
  email: string;
  profileImageUrl: string;
  favorites: FavoriteEntry[]
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  register(data: { fullname: string; email: string; password: string }) {
    return this.http.post<User>('/api/auth/register', data).pipe(
      tap(user => this.userSubject.next(user)),
      catchError(err => throwError(() => err))
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<User>('/api/auth/login', data).pipe(
      tap(user => this.userSubject.next(user)),
      catchError(err => throwError(() => err))
    );
  }

  logout() {
    return this.http.post('/api/auth/logout', {}).pipe(
      tap(() => this.userSubject.next(null)),
      catchError(err => throwError(() => err))
    );
  }

  getProfile() {
    return this.http.get<User>('/api/auth//me').pipe(
      tap(user => this.userSubject.next(user)),
      catchError(() => {
        this.userSubject.next(null);
        return throwError(() => new Error('Not logged in'));
      })
    );
  }

  getCurrentUser() {
    return this.userSubject.value;
  }

  deleteAccount() {
    return this.http.delete('/api/auth/delete-account').pipe(
      tap(() => this.userSubject.next(null)),
      catchError(err => throwError(() => err))
    );
  }

  addFavorite(artistId: string) {
    return this.http.post('/api/favorites', { artistId }).pipe(
      tap(() => {
        const user = this.userSubject.value;
        if (user && !user.favorites.some(fav => fav.artistId === artistId)) {
          this.userSubject.next({
            ...user,
            favorites: [...user.favorites, { artistId, addedAt: new Date().toISOString() }]
          });
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  removeFavorite(artistId: string) {
    return this.http.delete(`/api/favorites/${artistId}`).pipe(
      tap(() => {
        const user = this.userSubject.value;
        if (user && user.favorites.some(fav => fav.artistId === artistId)) {
          this.userSubject.next({
            ...user,
            favorites: user.favorites.filter(fav => fav.artistId !== artistId)
          });
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  getFavorites(): Observable<{ artistId: string; addedAt: string }[]> {
    return this.http.get<{ artistId: string; addedAt: string }[]>('/api/favorites').pipe(
      catchError(err => throwError(() => err))
    );
  }

  checkEmailExists(email: string) {
    return this.http.get<{ exists: boolean }>(`/api/auth/check-email?email=${encodeURIComponent(email)}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
