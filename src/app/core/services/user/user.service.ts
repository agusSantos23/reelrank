import { HttpClient } from '@angular/common/http';
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

}