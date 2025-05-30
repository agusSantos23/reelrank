import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {

  private cookieService = inject(CookieService);
  private readonly tokenKey = 'auth_token';

  setToken(token: string, expires: Date, options?: any): void {
    this.cookieService.set(this.tokenKey, token, { path: '/', expires: expires, ...options });
  }

  getToken(): string | null {
    return this.cookieService.get(this.tokenKey) || null;
  }

  deleteToken(): void {
    this.cookieService.delete(this.tokenKey, '/');
  }

  decodeToken(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwt_decode.jwtDecode(token);
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
    return null;
  }

  getUserIdFromToken(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken?.id || null;
  }

}