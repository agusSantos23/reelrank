import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs'; 
import { AuthService } from './auth.service';
import { TokenServiceService } from '../token-service/token-service.service';
import { UserService } from '../user/user.service';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let tokenServiceSpy: jasmine.SpyObj<TokenServiceService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    tokenServiceSpy = jasmine.createSpyObj('TokenServiceService', ['setToken', 'deleteToken']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser', 'clearUser']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: TokenServiceService, useValue: tokenServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    service = TestBed.inject(AuthService);

    environment.apiUrl = 'http://test-api.com';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    const mockRegisterData = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      name: 'John',                
      lastname: 'Doe',              
      password_confirmation: 'password123' 
    };
    const mockRegisterResponse = { message: 'User registered', token: 'fake-register-token' };

    it('should call http.post for registration and handle token/user data on success', (done) => {
      httpClientSpy.post.and.returnValue(of(mockRegisterResponse));

      service.register(mockRegisterData).subscribe(() => {
        expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.apiUrl}/auth/register`, mockRegisterData);
        expect(tokenServiceSpy.setToken).toHaveBeenCalledWith(
          mockRegisterResponse.token,
          jasmine.any(Date)
        );
        const setTokenDate: Date = tokenServiceSpy.setToken.calls.argsFor(0)[1];
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() + 7);
        expect(setTokenDate.toDateString()).toBe(expectedDate.toDateString());

        expect(userServiceSpy.getUser).toHaveBeenCalled();
        done();
      });
    });

    it('should not set token or get user if registration response has no token', (done) => {
      const responseWithoutToken = { message: 'User registered' };
      httpClientSpy.post.and.returnValue(of(responseWithoutToken));

      service.register(mockRegisterData).subscribe(() => {
        expect(tokenServiceSpy.setToken).not.toHaveBeenCalled();
        expect(userServiceSpy.getUser).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('login', () => {
    const mockLoginCredentials = { email: 'test@example.com', password: 'password123' };
    const mockLoginResponse = { message: 'Login successful', token: 'fake-login-token' };

    it('should call http.post for login and handle token/user data on success', (done) => {
      httpClientSpy.post.and.returnValue(of(mockLoginResponse));

      service.login(mockLoginCredentials).subscribe(() => {
        expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.apiUrl}/auth/login`, mockLoginCredentials);
        expect(tokenServiceSpy.setToken).toHaveBeenCalledWith(
          mockLoginResponse.token,
          jasmine.any(Date)
        );
        const setTokenDate: Date = tokenServiceSpy.setToken.calls.argsFor(0)[1];
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() + 7);
        expect(setTokenDate.toDateString()).toBe(expectedDate.toDateString());

        expect(userServiceSpy.getUser).toHaveBeenCalled();
        done();
      });
    });

    it('should not set token or get user if login response has no token', (done) => {
      const responseWithoutToken = { message: 'Login successful' };
      httpClientSpy.post.and.returnValue(of(responseWithoutToken));

      service.login(mockLoginCredentials).subscribe(() => {
        expect(tokenServiceSpy.setToken).not.toHaveBeenCalled();
        expect(userServiceSpy.getUser).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('logout', () => {
    it('should call tokenService.deleteToken and userService.clearUser', () => {
      service.logout();
      expect(tokenServiceSpy.deleteToken).toHaveBeenCalled();
      expect(userServiceSpy.clearUser).toHaveBeenCalled();
    });
  });
});