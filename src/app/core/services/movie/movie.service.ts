import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MovieBasicInfo } from '../../models/movie/MovieBasicInfo.model';
import { Movie } from '../../models/movie/Movie.model';
import { UserService } from '../user/user.service';



@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private http = inject(HttpClient);
  private userService = inject(UserService);
  private apiUrl = environment.apiUrl;


  public getMovies(page: number = 1, limit: number = 30, genreIds?: string[], selectedOrderBy?: string, searchTerm?: string): Observable<MovieBasicInfo[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

      if (genreIds && genreIds.length > 0) params = params.set('genres', genreIds.join(',')); 
      

      if (selectedOrderBy) params = params.set('orderBy', selectedOrderBy);
      

      if (searchTerm) params = params.set('searchTerm', searchTerm);      

    return this.http.get<MovieBasicInfo[]>(`${this.apiUrl}/movies`, { params });
  }

  public getMovie(movieId: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${movieId}`);
  }

  public getUserMovie(movieId: string, userId: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${movieId}/${userId}`);
  }

  public getMoviesUser(page: number = 1, limit: number = 30, searchTerm?: string, list: string = 'favorite'): Observable<MovieBasicInfo[]> {
    const authInfo = this.userService.getAuthHeaders()

    if (!authInfo) return of([]);
    
    const { headers, userId } = authInfo;
    
    let params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString())
    .set('list', list);    

    if (searchTerm) params = params.set('searchTerm', searchTerm);      

    return this.http.get<MovieBasicInfo[]>(`${this.apiUrl}/user/movies/${userId}`, { headers: headers, params: params });
  }

}

