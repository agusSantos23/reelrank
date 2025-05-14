import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Genre } from '../../models/Genre.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  getGenres(): Observable<Genre[]> {

    const authInfo = this.userService.getAuthHeaders();

    if (authInfo) {

      const { headers, userId } = authInfo;
      
      return this.http.get<Genre[]>(`${this.apiUrl}/genres/${userId}`);

    } else {
      return this.http.get<Genre[]>(`${this.apiUrl}/genres/`);

    }

  }



}
