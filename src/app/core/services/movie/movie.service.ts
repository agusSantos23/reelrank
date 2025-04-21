import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MovieBasicInfo } from '../../models/movie/MovieBasicInfo.model';
import { Movie } from '../../models/movie/Movie.model';



@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;


  getMovies(page: number = 1, limit: number = 30, genreIds?: string[], selectedOrderBy?: string, searchTerm?: string): Observable<MovieBasicInfo[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

      if (genreIds && genreIds.length > 0) params = params.set('genres', genreIds.join(',')); 
      

      if (selectedOrderBy) params = params.set('orderBy', selectedOrderBy);
      

      if (searchTerm) params = params.set('searchTerm', searchTerm);      

    return this.http.get<MovieBasicInfo[]>(`${this.apiUrl}/movies`, { params });
  }

  getMovie(movieId: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${movieId}`);
  }


}

