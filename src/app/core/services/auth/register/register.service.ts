import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { RegisterUser } from '../../../models/auth/RegisterUser.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  registerUser(userData: RegisterUser): Observable<any>{
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }
}
