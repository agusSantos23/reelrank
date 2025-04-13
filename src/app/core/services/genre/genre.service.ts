import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Genre } from '../../models/Genre.model';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  getGenres(): Observable<Genre[]>{
    return this.http.get<Genre[]>(`${this.apiUrl}/genres`);
  }

}
