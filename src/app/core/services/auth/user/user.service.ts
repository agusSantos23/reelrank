import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { UserData } from '../../../models/UserData.model';
import { Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private router = inject(Router); 
  private apiUrl = environment.apiUrl;

  public getUserData(): Observable<UserData> {
    const userId = this.getUserIdFromToken(); 
    return this.http.get<UserData>(`${this.apiUrl}/auth/token/${userId}`);
  }

  public logout(): void {
    localStorage.removeItem('auth_token'); 
    this.router.navigate(['/login']);
  }

  private getUserIdFromToken(): string {
    const token = localStorage.getItem('auth_token'); 
    
    if (!token) throw new Error("User not authenticated");

    
    const decodedToken: any = jwt_decode.jwtDecode(token);
    
    return decodedToken.id; 
  }
}
