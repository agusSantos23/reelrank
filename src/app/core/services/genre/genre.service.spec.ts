import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { GenreService } from './genre.service';
import { UserService } from '../user/user.service';
import { environment } from '../../../../environments/environment';
import { Genre } from '../../models/Genre.model'; 

describe('GenreService', () => {
  let service: GenreService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getAuthHeaders']);

    TestBed.configureTestingModule({
      providers: [
        GenreService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    service = TestBed.inject(GenreService);

    environment.apiUrl = 'http://test-api.com';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.get with userId if authInfo is present', (done) => {
    const mockAuthInfo = { headers: {}, userId: 'user123' };
    userServiceSpy.getAuthHeaders.and.returnValue(mockAuthInfo as any);
    const mockGenres: Genre[] = [{ id: '1', name: 'Action', active: true }];
    httpClientSpy.get.and.returnValue(of(mockGenres));

    service.getGenres().subscribe(genres => {
      expect(genres).toEqual(mockGenres);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/genres/${mockAuthInfo.userId}`);
      done();
    });
  });

  it('should call http.get without userId if authInfo is not present', (done) => {
    userServiceSpy.getAuthHeaders.and.returnValue(null);
    const mockGenres: Genre[] = [{ id: '2', name: 'Comedy', active: false }];
    httpClientSpy.get.and.returnValue(of(mockGenres));

    service.getGenres().subscribe(genres => {
      expect(genres).toEqual(mockGenres);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/genres/`);
      done();
    });
  });

  it('should return empty array if http.get returns empty array', (done) => {
    userServiceSpy.getAuthHeaders.and.returnValue(null);
    const mockGenres: Genre[] = [];
    httpClientSpy.get.and.returnValue(of(mockGenres));

    service.getGenres().subscribe(genres => {
      expect(genres).toEqual([]);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/genres/`);
      done();
    });
  });
});