import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { BasicUser } from '../../models/auth/DataUser.model';
import { TokenServiceService } from '../token-service/token-service.service';
import { DecodedToken } from '../../models/Token.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenServiceService);
  private apiUrl = environment.apiUrl;

  private _currentUser = new BehaviorSubject<BasicUser | null>(null);
  public readonly currentUser$ = this._currentUser.asObservable();

  private getAuthHeaders(): { headers: HttpHeaders; userId: string } | null {
    const token = this.tokenService.getToken();
    if (!token) {
      console.error('Token not found.');
      return null;
    }

    try {
      const decodedToken: DecodedToken = jwt_decode.jwtDecode(token);
      const userId = decodedToken.id;

      if (!userId) {
        console.error('User ID not found in token.');
        return null;
      }

      return {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        }),
        userId: userId
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  public getUser(): void {
    if ( this._currentUser.getValue() === null) {
      const token = this.tokenService.getToken();

      if (!token) {
        this._currentUser.next(null);
        return;
      }

      const decodedToken: DecodedToken = jwt_decode.jwtDecode(token);

      this.http.get<BasicUser>(`${this.apiUrl}/auth/token/${decodedToken.id}`).pipe(
        tap((user) => {
          this._currentUser.next(user);
        }),
        catchError((error) => {
          this._currentUser.next(null);
          console.error('Error charging the user:', error);
          return of(null);
        })
      ).subscribe();
    }
  }

  public clearUser(): void {
    this._currentUser.next(null);
  }

  public rateMovie(movieId: string, column: string, value: number): Observable<any> {
    
    const authInfo = this.getAuthHeaders();

    if (!authInfo) return of(null);
    
    const { headers, userId } = authInfo;

    return this.http.patch<any>(
      `${this.apiUrl}/usermovies/${userId}/${movieId}/rate`, 
      { column, value }, { headers }
    )
  }

  public favoriteMovie(movieId: string, value: boolean): Observable<any> {
    const authInfo = this.getAuthHeaders();

    if (!authInfo) return of(null);
    
    const { headers, userId } = authInfo;

    return this.http.patch<any>(
      `${this.apiUrl}/usermovies/${userId}/${movieId}/favorite`, 
      { value }, { headers }
    )
  }

  public seeMovie(movieId: string, value: boolean | null): Observable<any> {
    const authInfo = this.getAuthHeaders();

    if (!authInfo) return of(null);
    
    const { headers, userId } = authInfo;
    
    return this.http.patch<any>(
      `${this.apiUrl}/usermovies/${userId}/${movieId}/seen`, 
      { value }, { headers }
    )
  }

}