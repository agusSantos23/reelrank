import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../../environments/environment';
import { TokenServiceService } from '../token-service/token-service.service';
import { NotificationService } from '../notification/notification.service';
import * as jwt_decode from 'jwt-decode';
import { BasicUser, StatisticsUser } from '../../models/auth/DataUser.model';
import { HttpHeaders } from '@angular/common/http';
import { DecodedToken } from '../../models/Token.model';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;
  let tokenServiceSpy: jasmine.SpyObj<TokenServiceService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let jwtDecodeSpy: jasmine.Spy;
  let apiUrl: string;

  const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoidGVzdHVzZXIifQ.Signature';
  const MOCK_USER_ID = '123';
  const MOCK_DECODED_TOKEN_PAYLOAD: DecodedToken = {
    id: MOCK_USER_ID,
    email: 'testuser@example.com',
    exp: Date.now() / 1000 + 3600,
    iat: Date.now() / 1000,
    iss: 'your-issuer',
    jti: 'unique-id',
    nbf: Date.now() / 1000,
    prv: 'some-provider',
    sub: 'testuser'
  };
  const MOCK_BASIC_USER: BasicUser = {
    id: MOCK_USER_ID,
    name: 'Test User',
    lastname: 'Test Lastname',
    email: 'test@example.com',
    deleted_last_movie_watchlist: false,
    avatar_id: 'avatar123',
    config_scorer: 'starts',
    maximum_star_rating: 5,
    maximum_slider_rating: 10,
    vote_type: 'simple',
    status: 'normal',
    action_count: 0,
    avatar: null,
    statistics: undefined,
    genres: []
  };
  const MOCK_STATISTICS_USER: StatisticsUser = {
    most_viewed_genre: 'Action',
    rated_movies: 10,
    average_rating: 7.5,
    watching_movies: 3
  };

  beforeEach(() => {
    tokenServiceSpy = jasmine.createSpyObj('TokenServiceService', ['getToken']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['show']);
    jwtDecodeSpy = spyOn(jwt_decode, 'jwtDecode');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: TokenServiceService, useValue: tokenServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
    apiUrl = environment.apiUrl;

    tokenServiceSpy.getToken.and.returnValue(null);
    jwtDecodeSpy.and.returnValue(MOCK_DECODED_TOKEN_PAYLOAD);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUser', () => {
    it('should set currentUser to null if no token is found', (done) => {
      tokenServiceSpy.getToken.and.returnValue(null);
      let currentUser: BasicUser | null = { ...MOCK_BASIC_USER };
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser).toBeNull();
        done();
      });

      service.getUser();

      expect(tokenServiceSpy.getToken).toHaveBeenCalled();
      expect(jwtDecodeSpy).not.toHaveBeenCalled();
      httpTestingController.expectNone(`${apiUrl}/auth/token/${MOCK_USER_ID}`);
    });

    it('should set currentUser to null if token decoding fails', (done) => {
      tokenServiceSpy.getToken.and.returnValue(MOCK_TOKEN);
      jwtDecodeSpy.and.throwError('Invalid token');
      spyOn(console, 'error');

      let currentUser: BasicUser | null = { ...MOCK_BASIC_USER };
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Error charging the user:', jasmine.any(Error));
        done();
      });

      service.getUser();

      expect(tokenServiceSpy.getToken).toHaveBeenCalled();
      expect(jwtDecodeSpy).toHaveBeenCalledWith(MOCK_TOKEN);
      httpTestingController.expectNone(`${apiUrl}/auth/token/${MOCK_USER_ID}`);
    });

    it('should set currentUser to null if HTTP request fails', (done) => {
      tokenServiceSpy.getToken.and.returnValue(MOCK_TOKEN);
      spyOn(console, 'error');

      let currentUser: BasicUser | null = { ...MOCK_BASIC_USER };
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Error charging the user:', jasmine.any(Object));
        done();
      });

      service.getUser();

      const req = httpTestingController.expectOne(`${apiUrl}/auth/token/${MOCK_USER_ID}`);
      req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

      expect(tokenServiceSpy.getToken).toHaveBeenCalled();
      expect(jwtDecodeSpy).toHaveBeenCalledWith(MOCK_TOKEN);
      expect(req.request.method).toBe('GET');
    });

    it('should update currentUser with fetched user if token is valid and HTTP succeeds', (done) => {
      tokenServiceSpy.getToken.and.returnValue(MOCK_TOKEN);

      let currentUser: BasicUser | null = null;
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser).toEqual(MOCK_BASIC_USER);
        done();
      });

      service.getUser();

      const req = httpTestingController.expectOne(`${apiUrl}/auth/token/${MOCK_USER_ID}`);
      req.flush(MOCK_BASIC_USER);

      expect(tokenServiceSpy.getToken).toHaveBeenCalled();
      expect(jwtDecodeSpy).toHaveBeenCalledWith(MOCK_TOKEN);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('statisticsUser', () => {
    it('should not make request if getAuthHeaders returns null', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue(null);
      let currentUser: BasicUser | null = null;
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser).toBeNull();
        done();
      });

      service.statisticsUser();

      expect(service.getAuthHeaders).toHaveBeenCalled();
      httpTestingController.expectNone(`${apiUrl}/user/${MOCK_USER_ID}/statistics`);
    });

    it('should fetch statistics and update currentUser if user exists', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      service['_currentUser'].next(MOCK_BASIC_USER);

      let currentUser: BasicUser | null = null;
      service.currentUser$.subscribe(user => {
        currentUser = user;
        const expectedUserWithStats: BasicUser = { ...MOCK_BASIC_USER, statistics: MOCK_STATISTICS_USER };
        expect(currentUser).toEqual(expectedUserWithStats);
        done();
      });

      service.statisticsUser();

      const req = httpTestingController.expectOne(`${apiUrl}/user/${MOCK_USER_ID}/statistics`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);

      req.flush(MOCK_STATISTICS_USER);

      expect(service.getAuthHeaders).toHaveBeenCalled();
    });

    it('should not update currentUser if no current user exists when statistics are fetched', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      service['_currentUser'].next(null);

      let currentUser: BasicUser | null = null;
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser).toBeNull();
        done();
      });

      service.statisticsUser();

      const req = httpTestingController.expectOne(`${apiUrl}/user/${MOCK_USER_ID}/statistics`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_STATISTICS_USER);

      expect(service.getAuthHeaders).toHaveBeenCalled();
    });

    it('should not update currentUser if statistics fetch fails', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      service['_currentUser'].next(MOCK_BASIC_USER);

      let currentUser: BasicUser | null = { ...MOCK_BASIC_USER };
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser).toEqual(MOCK_BASIC_USER);
        done();
      });

      service.statisticsUser();

      const req = httpTestingController.expectOne(`${apiUrl}/user/${MOCK_USER_ID}/statistics`);
      expect(req.request.method).toBe('GET');
      req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

      expect(service.getAuthHeaders).toHaveBeenCalled();
    });
  });

  describe('clearUser', () => {
    it('should set currentUser to null', (done) => {
      service['_currentUser'].next(MOCK_BASIC_USER);

      let currentUser: BasicUser | null = { ...MOCK_BASIC_USER };
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser).toBeNull();
        done();
      });

      service.clearUser();
    });
  });

  describe('rateMovie', () => {
    it('should return null observable if getAuthHeaders returns null', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue(null);

      service.rateMovie('movie1', 'rating', 5).subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      expect(service.getAuthHeaders).toHaveBeenCalled();
      httpTestingController.expectNone(`${apiUrl}/usermovies/${MOCK_USER_ID}/movie1/rate`);
    });

    it('should make a PATCH request to rate a movie', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const movieId = 'movie123';
      const column = 'rating';
      const value = 8;
      const expectedResponse = { success: true, newRating: 8 };

      service.rateMovie(movieId, column, value).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/usermovies/${MOCK_USER_ID}/${movieId}/rate`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ column, value });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      req.flush(expectedResponse);
    });
  });

  describe('favoriteMovie', () => {
    it('should return null observable if getAuthHeaders returns null', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue(null);

      service.favoriteMovie('movie1', true).subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      expect(service.getAuthHeaders).toHaveBeenCalled();
      httpTestingController.expectNone(`${apiUrl}/usermovies/${MOCK_USER_ID}/movie1/favorite`);
    });

    it('should make a PATCH request to favorite a movie', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const movieId = 'movie123';
      const value = true;
      const expectedResponse = { success: true, isFavorite: true };

      service.favoriteMovie(movieId, value).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/usermovies/${MOCK_USER_ID}/${movieId}/favorite`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ value });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      req.flush(expectedResponse);
    });
  });

  describe('seeMovie', () => {
    it('should return null observable if getAuthHeaders returns null', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue(null);

      service.seeMovie('movie1', true).subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      expect(service.getAuthHeaders).toHaveBeenCalled();
      httpTestingController.expectNone(`${apiUrl}/usermovies/${MOCK_USER_ID}/movie1/seen`);
    });

    it('should make a PATCH request to mark a movie as seen', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const movieId = 'movie123';
      const value = true;
      const expectedResponse = { success: true, seen: true };

      service.seeMovie(movieId, value).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/usermovies/${MOCK_USER_ID}/${movieId}/seen`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ value });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      req.flush(expectedResponse);
    });
  });

  describe('favoriteGenres', () => {
    it('should return null observable if getAuthHeaders returns null', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue(null);

      service.favoriteGenres(['Action']).subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      expect(service.getAuthHeaders).toHaveBeenCalled();
      httpTestingController.expectNone(`${apiUrl}/settings/usergenres/${MOCK_USER_ID}`);
    });

    it('should make a POST request to set favorite genres', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const genreIds = ['action', 'comedy'];
      const expectedResponse = { success: true, genres: genreIds };

      service.favoriteGenres(genreIds).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/settings/usergenres/${MOCK_USER_ID}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ genre_ids: genreIds });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      req.flush(expectedResponse);
    });
  });

  describe('selectEvaluator', () => {
    it('should return null observable if getAuthHeaders returns null', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue(null);

      service.selectEvaluator('starts').subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      expect(service.getAuthHeaders).toHaveBeenCalled();
      httpTestingController.expectNone(`${apiUrl}/settings/evaluator/${MOCK_USER_ID}`);
    });

    it('should make a POST request to select evaluator', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const evaluatorType = 'slider';
      const expectedResponse = { success: true, evaluator: evaluatorType };

      service.selectEvaluator(evaluatorType).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/settings/evaluator/${MOCK_USER_ID}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ value: evaluatorType });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      req.flush(expectedResponse);
    });
  });

  describe('highestEvaluation', () => {
    it('should return null observable if getAuthHeaders returns null', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue(null);

      service.highestEvaluation('starts', 10).subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      expect(service.getAuthHeaders).toHaveBeenCalled();

      httpTestingController.expectNone(`${apiUrl}/settings/highest/${MOCK_USER_ID}/starts`);
    });

    it('should make a POST request to set highest evaluation', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const evaluatorType = 'starts';
      const max = 5;
      const expectedResponse = { success: true, maxEvaluation: max };

      service.highestEvaluation(evaluatorType, max).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/settings/highest/${MOCK_USER_ID}/${evaluatorType}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ max });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      req.flush(expectedResponse);
    });
  });

  describe('updateUserField', () => {
    it('should return null observable if getAuthHeaders returns null', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue(null);

      service.updateUserField('email', 'new@example.com').subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      expect(service.getAuthHeaders).toHaveBeenCalled();
      httpTestingController.expectNone(`${apiUrl}/user/${MOCK_USER_ID}`);
    });

    it('should make a PATCH request to update email field', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const newEmail = 'new@example.com';
      const expectedResponse = { ...MOCK_BASIC_USER, email: newEmail };

      service.updateUserField('email', newEmail).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/user/${MOCK_USER_ID}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ email: newEmail });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      req.flush(expectedResponse);
    });

    it('should make a PATCH request to update password field', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const passwordData = { password: 'new_password', password_confirmation: 'new_password' };
      const expectedResponse = { success: true };

      service.updateUserField('password', passwordData).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/user/${MOCK_USER_ID}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(passwordData);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      req.flush(expectedResponse);
    });
  });

  describe('unblockUser', () => {
    it('should return null observable if getAuthHeaders returns null', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue(null);

      service.unblockUser().subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      expect(service.getAuthHeaders).toHaveBeenCalled();
      httpTestingController.expectNone(`${apiUrl}/user/${MOCK_USER_ID}/unblock`);
      expect(notificationServiceSpy.show).not.toHaveBeenCalled();
    });

    it('should make a POST request to unblock user, update currentUser, and show success notification on success', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const unblockedUserResponse: BasicUser = { ...MOCK_BASIC_USER, status: 'normal' };

      service['_currentUser'].next({ ...MOCK_BASIC_USER, status: 'blocked' });

      let currentUserAfterUpdate: BasicUser | null = null;
      service.currentUser$.subscribe(user => {
        currentUserAfterUpdate = user;
      });

      service.unblockUser().subscribe(response => {
        expect(response).toEqual(unblockedUserResponse);
        expect(currentUserAfterUpdate).toEqual(unblockedUserResponse);
        expect(notificationServiceSpy.show).toHaveBeenCalledWith({
          type: 'text',
          isError: false,
          text: 'Your account has been unlocked.',
          duration: 3000,
          position: 'tr'
        });
        done();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/user/${MOCK_USER_ID}/unblock`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      req.flush(unblockedUserResponse);
    });

    it('should show error notification on unblock failure', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const originalUser: BasicUser = { ...MOCK_BASIC_USER, status: 'blocked' };
      service['_currentUser'].next(originalUser);

      const errorMessage = 'Failed to unblock';
      const errorResponsePayload = { message: errorMessage };

      let currentUser: BasicUser | null = { ...originalUser };
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser).toEqual(originalUser);
        expect(notificationServiceSpy.show).toHaveBeenCalledWith({
          type: 'text',
          isError: true,
          text: errorMessage,
          duration: 5000,
          position: 'tr'
        });
        done();
      });

      service.unblockUser().subscribe(result => {
        expect(result).toBeNull();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/user/${MOCK_USER_ID}/unblock`);
      req.flush(errorResponsePayload, { status: 400, statusText: 'Bad Request' });
    });

    it('should show generic error notification if error message is not available', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      service['_currentUser'].next(MOCK_BASIC_USER);

      service.unblockUser().subscribe(result => {
        expect(result).toBeNull();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/user/${MOCK_USER_ID}/unblock`);
      req.error(new ProgressEvent('error'), { status: 400, statusText: 'Bad Request' });

      // No necesitamos subscribirnos a currentUser$ para esta aserción específica
      expect(notificationServiceSpy.show).toHaveBeenCalledWith({
        type: 'text',
        isError: true,
        text: 'Error trying to unlock the account.',
        duration: 5000,
        position: 'tr'
      });
      done();
    });
  });

  describe('setUserBlocked', () => {
    it('should update currentUser status to blocked if user exists', (done) => {
      const initialUser: BasicUser = { ...MOCK_BASIC_USER, status: 'normal' }; // Cambiado 'active' a 'normal'
      service['_currentUser'].next(initialUser);

      let currentUser: BasicUser | null = { ...initialUser };
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser?.status).toBe('blocked');
        expect(currentUser?.id).toBe(initialUser.id);
        done();
      });

      service.setUserBlocked();
    });

    it('should do nothing if currentUser is null', (done) => {
      service['_currentUser'].next(null);

      let currentUser: BasicUser | null = null;
      service.currentUser$.subscribe(user => {
        currentUser = user;
        expect(currentUser).toBeNull();
        done();
      });

      service.setUserBlocked();
    });
  });

  describe('getAuthHeaders', () => {
    it('should return null and log error if no token is found', () => {
      tokenServiceSpy.getToken.and.returnValue(null);
      spyOn(console, 'error');

      const result = service.getAuthHeaders();

      expect(tokenServiceSpy.getToken).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Token not found.');
      expect(result).toBeNull();
    });

    it('should return null and log error if token decoding fails', () => {
      tokenServiceSpy.getToken.and.returnValue(MOCK_TOKEN);
      jwtDecodeSpy.and.throwError('Invalid token');
      spyOn(console, 'error');

      const result = service.getAuthHeaders();

      expect(tokenServiceSpy.getToken).toHaveBeenCalled();
      expect(jwtDecodeSpy).toHaveBeenCalledWith(MOCK_TOKEN);
      expect(console.error).toHaveBeenCalledWith('Error decoding token:', jasmine.any(Error));
      expect(result).toBeNull();
    });

    it('should return null and log error if user ID is not found in token', () => {
      tokenServiceSpy.getToken.and.returnValue(MOCK_TOKEN);
      jwtDecodeSpy.and.returnValue({ ...MOCK_DECODED_TOKEN_PAYLOAD, id: undefined as any }); // 'as any' para permitir undefined
      spyOn(console, 'error');

      const result = service.getAuthHeaders();

      expect(tokenServiceSpy.getToken).toHaveBeenCalled();
      expect(jwtDecodeSpy).toHaveBeenCalledWith(MOCK_TOKEN);
      expect(console.error).toHaveBeenCalledWith('User ID not found in token.');
      expect(result).toBeNull();
    });

    it('should return headers and userId if token is valid and contains ID', () => {
      tokenServiceSpy.getToken.and.returnValue(MOCK_TOKEN);

      const result = service.getAuthHeaders();

      expect(tokenServiceSpy.getToken).toHaveBeenCalled();
      expect(jwtDecodeSpy).toHaveBeenCalledWith(MOCK_TOKEN);
      expect(result).toEqual({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      expect(result?.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      expect(result?.userId).toBe(MOCK_USER_ID);
    });
  });

  describe('deleteUser', () => {
    it('should return null observable if getAuthHeaders returns null', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue(null);

      service.deleteUser().subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      expect(service.getAuthHeaders).toHaveBeenCalled();
      httpTestingController.expectNone(`${apiUrl}/user/${MOCK_USER_ID}`);
    });

    it('should make a DELETE request to delete user', (done) => {
      spyOn(service, 'getAuthHeaders').and.returnValue({
        headers: new HttpHeaders({ 'Authorization': `Bearer ${MOCK_TOKEN}` }),
        userId: MOCK_USER_ID
      });
      const expectedResponse = { success: true, message: 'User deleted' };

      service.deleteUser().subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      const req = httpTestingController.expectOne(`${apiUrl}/user/${MOCK_USER_ID}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
      req.flush(expectedResponse);
    });
  });
});