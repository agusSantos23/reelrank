import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BasicUser, RegisterUser } from '../../models/auth/DataUser.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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


  public register(userData: RegisterUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((response: any) => {

        const token = response?.token;

        if (token) {
          const defaultExpiration = new Date();
          defaultExpiration.setDate(defaultExpiration.getDate() + 7); 
          this.tokenService.setToken(token, defaultExpiration);
        }
      })
    );
  }


  public logout(): void {
    console.log(1);
    
    this.tokenService.deleteToken();
    this.userService.clearUser();
  }


}
