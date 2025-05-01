import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoginUser, RegisterUser } from '../../models/auth/DataUser.model';
import { Observable, tap } from 'rxjs';
import { TokenServiceService } from '../token-service/token-service.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenServiceService); 
  private userService = inject(UserService); 
  private apiUrl = environment.apiUrl;
  private tokenLife = 7;


  public register(userData: RegisterUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((response: any) => {

        const token = response?.token;

        if (token) {
          const defaultExpiration = new Date();
          defaultExpiration.setDate(defaultExpiration.getDate() + this.tokenLife); 
          this.tokenService.setToken(token, defaultExpiration);
          this.userService.getUser();
        }
      })
    );
  }


  public login(credentials: LoginUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {

        const token = response?.token;

        if (token) {
          const defaultExpiration = new Date();
          defaultExpiration.setDate(defaultExpiration.getDate() + this.tokenLife);
          this.tokenService.setToken(token, defaultExpiration);
          this.userService.getUser();
        }
      })
    );
  }

  public logout(): void {
    
    this.tokenService.deleteToken();
    this.userService.clearUser();
  }


}
