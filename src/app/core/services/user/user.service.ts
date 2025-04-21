import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, catchError, Observable, of, take, tap } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { BasicUser } from '../../models/auth/DataUser.model';
import { TokenServiceService } from '../token-service/token-service.service';
import { Router } from '@angular/router';
import { DecodedToken } from '../../models/Token.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenServiceService); 
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private _currentUser = new BehaviorSubject<BasicUser | null>(null);
  public readonly currentUser$ = this._currentUser.asObservable().pipe(take(1));
  private _hasLoadedUser = false;


  public getUser(): Observable<BasicUser | null> {
    if (!this._hasLoadedUser) {
      return this.loadUser().pipe(
        tap(() => this._hasLoadedUser = true)
      );
    }
    return this.currentUser$;
  }

  private loadUser(): Observable<BasicUser | null> {
    const token = this.tokenService.getToken();

    if (!token) return of(null);
    

    const decodedToken: DecodedToken = jwt_decode.jwtDecode(token); 
    
    return this.http.get<BasicUser>(`${this.apiUrl}/auth/token/${decodedToken.id}`).pipe(
      tap((user) => this._currentUser.next(user)),
      catchError((error) => {
        this._currentUser.next(null);
        console.error('Error al cargar el usuario:', error);
        return of(null);
      })
    );
  }

  public clearUser(): void {
    this._currentUser.next(null);
    this._hasLoadedUser = false; 
  }

}
