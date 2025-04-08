import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MovieBasicInfo } from '../../models/movie/movieBasicInfo';



@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  getMovies(page: number = 1, limit: number = 30): Observable<MovieBasicInfo[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<MovieBasicInfo[]>(`${this.apiUrl}/movies`, { params });
  }


}

