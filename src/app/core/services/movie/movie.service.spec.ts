import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { MovieService,  } from './movie.service';
import { UserService } from '../user/user.service';
import { environment } from '../../../../environments/environment';
import { Movie, UserRelation } from '../../models/movie/Movie.model';
import { MovieBasicInfo } from '../../models/movie/MovieBasicInfo.model';


describe('MovieService', () => {
  let service: MovieService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getAuthHeaders']);

    TestBed.configureTestingModule({
      providers: [
        MovieService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    service = TestBed.inject(MovieService);

    environment.apiUrl = 'http://test-api.com';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMovies', () => {
    const mockMovies: MovieBasicInfo[] = [
      { id: '1', title: 'Movie 1', releaseYear: 2020, duration: 120, score: 8.5, posterId: 'abc' },
      { id: '2', title: 'Movie 2', releaseYear: 2021, duration: 90, score: 7.0, posterId: 'def' }
    ];

    it('should get movies with default pagination', (done) => {
      httpClientSpy.get.and.returnValue(of(mockMovies));

      service.getMovies().subscribe(movies => {
        expect(movies).toEqual(mockMovies);
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/movies`, {
          params: new HttpParams().set('page', '1').set('limit', '30')
        });
        done();
      });
    });

    it('should get movies with custom pagination', (done) => {
      httpClientSpy.get.and.returnValue(of(mockMovies));

      service.getMovies(2, 10).subscribe(movies => {
        expect(movies).toEqual(mockMovies);
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/movies`, {
          params: new HttpParams().set('page', '2').set('limit', '10')
        });
        done();
      });
    });

    it('should get movies with genreIds', (done) => {
      httpClientSpy.get.and.returnValue(of(mockMovies));
      const genreIds = ['genre1', 'genre2'];

      service.getMovies(1, 30, genreIds).subscribe(movies => {
        expect(movies).toEqual(mockMovies);
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/movies`, {
          params: new HttpParams().set('page', '1').set('limit', '30').set('genres', 'genre1,genre2')
        });
        done();
      });
    });

    it('should get movies with orderBy', (done) => {
      httpClientSpy.get.and.returnValue(of(mockMovies));
      const orderBy = 'releaseDate';

      service.getMovies(1, 30, [], orderBy).subscribe(movies => {
        expect(movies).toEqual(mockMovies);
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/movies`, {
          params: new HttpParams().set('page', '1').set('limit', '30').set('orderBy', orderBy)
        });
        done();
      });
    });

    it('should get movies with searchTerm', (done) => {
      httpClientSpy.get.and.returnValue(of(mockMovies));
      const searchTerm = 'action';

      service.getMovies(1, 30, [], undefined, searchTerm).subscribe(movies => {
        expect(movies).toEqual(mockMovies);
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/movies`, {
          params: new HttpParams().set('page', '1').set('limit', '30').set('searchTerm', searchTerm)
        });
        done();
      });
    });

    it('should get movies with all filters combined', (done) => {
      httpClientSpy.get.and.returnValue(of(mockMovies));
      const genreIds = ['genreA'];
      const orderBy = 'score';
      const searchTerm = 'comedy';

      service.getMovies(3, 50, genreIds, orderBy, searchTerm).subscribe(movies => {
        expect(movies).toEqual(mockMovies);
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/movies`, {
          params: new HttpParams()
            .set('page', '3')
            .set('limit', '50')
            .set('genres', 'genreA')
            .set('orderBy', orderBy)
            .set('searchTerm', searchTerm)
        });
        done();
      });
    });
  });

  describe('getMovie', () => {
    const mockUserRelation: UserRelation = {
      user_id: 'user123',
      movie_id: 'movie123',
      rating: 8,
      acting_rating: 8,
      music_rating: 7,
      pacing_rating: 9,
      story_rating: 8,
      entertainment_rating: 9,
      visuals_rating: 8,
      is_favorite: true,
      seen: 1 
    };

    const mockMovie: Movie = {
      id: 'movie123',
      title: 'Movie Title',
      original_title: 'Original Movie Title',
      overview: 'An exciting movie about testing.',
      original_language: 'en',
      score: 8.5, 
      release_date: '2022-01-01',
      budget: 10000000, 
      revenue: 50000000, 
      runtime: 120, 
      status: 'enabled', 
      tagline: 'A tagline for the test movie', 
      poster_id: 'xyz_poster', 
      backdrop_id: 'xyz_backdrop', 
      created_at: '2022-01-01T10:00:00Z',
      updated_at: '2022-01-01T11:00:00Z',
      genres: [{ id: 'g1', name: 'Drama' }], 
      user_relation: mockUserRelation
    };

    it('should get a single movie by ID', (done) => {
      httpClientSpy.get.and.returnValue(of(mockMovie));

      service.getMovie('movie123').subscribe(movie => {
        expect(movie).toEqual(mockMovie);
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/movies/movie123`);
        done();
      });
    });
  });

  describe('getUserMovie', () => {
    const mockUserRelation: UserRelation = {
      user_id: 'userABC',
      movie_id: 'userMovie123',
      rating: 7,
      acting_rating: 7,
      music_rating: 6,
      pacing_rating: 8,
      story_rating: 7,
      entertainment_rating: 8,
      visuals_rating: 7,
      is_favorite: false,
      seen: true
    };

    // Mock de Movie que coincide exactamente con tu interfaz Movie
    const mockUserMovie: Movie = {
      id: 'userMovie123',
      title: 'User Movie Title',
      original_title: 'Original User Movie Title',
      overview: 'A user-specific movie for testing.',
      original_language: 'es',
      score: 7.8,
      release_date: '2023-03-15',
      budget: 5000000,
      revenue: 20000000,
      runtime: 100,
      status: 'enabled',
      tagline: 'A user movie tagline.',
      poster_id: 'uvw_poster',
      backdrop_id: 'uvw_backdrop',
      created_at: '2023-03-15T12:00:00Z',
      updated_at: '2023-03-15T13:00:00Z',
      genres: [{ id: 'g2', name: 'Action' }], 
      user_relation: mockUserRelation
    };

    it('should get a single user movie by movie and user ID', (done) => {
      httpClientSpy.get.and.returnValue(of(mockUserMovie));

      service.getUserMovie('userMovie123', 'userABC').subscribe(movie => {
        expect(movie).toEqual(mockUserMovie);
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/movies/userMovie123/userABC`);
        done();
      });
    });
  });

  describe('getMoviesUser', () => {
    const mockUserMovies: MovieBasicInfo[] = [
      { id: 'u1', title: 'User Fav 1', releaseYear: 2020, duration: 100, score: 7.0, posterId: 'p1' },
      { id: 'u2', title: 'User Fav 2', releaseYear: 2021, duration: 110, score: 8.0, posterId: 'p2' }
    ];
    const mockAuthInfo = { headers: { Authorization: 'Bearer token' }, userId: 'user456' };

    it('should get user movies if authInfo is present', (done) => {
      userServiceSpy.getAuthHeaders.and.returnValue(mockAuthInfo as any);
      httpClientSpy.get.and.returnValue(of(mockUserMovies));

      service.getMoviesUser().subscribe(movies => {
        expect(movies).toEqual(mockUserMovies);
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/user/movies/user456`, {
          headers: mockAuthInfo.headers,
          params: new HttpParams().set('page', '1').set('limit', '30').set('list', 'favorite')
        });
        done();
      });
    });

    it('should return empty array if authInfo is not present', (done) => {
      userServiceSpy.getAuthHeaders.and.returnValue(null);

      service.getMoviesUser().subscribe(movies => {
        expect(movies).toEqual([]);
        expect(httpClientSpy.get).not.toHaveBeenCalled();
        done();
      });
    });

    it('should get user movies with custom list and search term', (done) => {
      userServiceSpy.getAuthHeaders.and.returnValue(mockAuthInfo as any);
      httpClientSpy.get.and.returnValue(of(mockUserMovies));

      service.getMoviesUser(1, 30, 'search-term', 'watched').subscribe(movies => {
        expect(movies).toEqual(mockUserMovies);
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/user/movies/user456`, {
          headers: mockAuthInfo.headers,
          params: new HttpParams().set('page', '1').set('limit', '30').set('list', 'watched').set('searchTerm', 'search-term')
        });
        done();
      });
    });
  });
});
