import { TestBed } from '@angular/core/testing';
import { TokenServiceService } from './token-service.service';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';

describe('TokenServiceService', () => {
  let service: TokenServiceService;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let jwtDecodeSpy: jasmine.Spy;

  const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoidGVzdHVzZXIifQ.Signature';
  const MOCK_DECODED_PAYLOAD = { id: '123', username: 'testuser', exp: Math.floor(Date.now() / 1000) + (60 * 60) };

  beforeEach(() => {
    cookieServiceSpy = jasmine.createSpyObj('CookieService', ['set', 'get', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        TokenServiceService,
        { provide: CookieService, useValue: cookieServiceSpy },
      ]
    });

    service = TestBed.inject(TokenServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setToken', () => {
    it('should set the token in cookies', () => {
      const expires = new Date();
      service.setToken(MOCK_TOKEN, expires);
      expect(cookieServiceSpy.set).toHaveBeenCalledWith('auth_token', MOCK_TOKEN, { path: '/', expires: expires });
    });

    it('should set the token with additional options', () => {
      const expires = new Date();
      const options = { secure: true, sameSite: 'Lax' as const };
      service.setToken(MOCK_TOKEN, expires, options);
      expect(cookieServiceSpy.set).toHaveBeenCalledWith('auth_token', MOCK_TOKEN, { path: '/', expires: expires, ...options });
    });
  });

  describe('getToken', () => {
    it('should return the token if it exists', () => {
      cookieServiceSpy.get.and.returnValue(MOCK_TOKEN);
      expect(service.getToken()).toBe(MOCK_TOKEN);
      expect(cookieServiceSpy.get).toHaveBeenCalledWith('auth_token');
    });

    it('should return null if the token does not exist', () => {
      cookieServiceSpy.get.and.returnValue('');
      expect(service.getToken()).toBeNull();
      expect(cookieServiceSpy.get).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('deleteToken', () => {
    it('should delete the token from cookies', () => {
      service.deleteToken();
      expect(cookieServiceSpy.delete).toHaveBeenCalledWith('auth_token', '/');
    });
  });

  describe('decodeToken', () => {
    beforeEach(() => {
      jwtDecodeSpy = spyOn(jwt_decode, 'jwtDecode');
    });

    it('should decode the token if it exists', () => {
      cookieServiceSpy.get.and.returnValue(MOCK_TOKEN);
      jwtDecodeSpy.and.returnValue(MOCK_DECODED_PAYLOAD);

      expect(service.decodeToken()).toEqual(MOCK_DECODED_PAYLOAD);
      expect(cookieServiceSpy.get).toHaveBeenCalledWith('auth_token');
      expect(jwtDecodeSpy).toHaveBeenCalledWith(MOCK_TOKEN);
    });

    it('should return null if no token is found', () => {
      cookieServiceSpy.get.and.returnValue('');
      expect(service.decodeToken()).toBeNull();
      expect(cookieServiceSpy.get).toHaveBeenCalledWith('auth_token');
      expect(jwtDecodeSpy).not.toHaveBeenCalled();
    });

    it('should return null and log error if token decoding fails', () => {
      spyOn(console, 'error');
      cookieServiceSpy.get.and.returnValue(MOCK_TOKEN);
      jwtDecodeSpy.and.throwError('Invalid token');

      expect(service.decodeToken()).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error decoding token', jasmine.any(Error));
    });
  });

  describe('getUserIdFromToken', () => {
    let decodeTokenSpy: jasmine.Spy;

    beforeEach(() => {
      decodeTokenSpy = spyOn(service, 'decodeToken');
    });

    it('should return the user ID from a decoded token', () => {
      decodeTokenSpy.and.returnValue(MOCK_DECODED_PAYLOAD);
      expect(service.getUserIdFromToken()).toBe('123');
      expect(decodeTokenSpy).toHaveBeenCalled();
    });

    it('should return null if the token is null', () => {
      decodeTokenSpy.and.returnValue(null);
      expect(service.getUserIdFromToken()).toBeNull();
      expect(decodeTokenSpy).toHaveBeenCalled();
    });

    it('should return null if the decoded token does not contain an ID', () => {
      decodeTokenSpy.and.returnValue({ username: 'testuser' });
      expect(service.getUserIdFromToken()).toBeNull();
      expect(decodeTokenSpy).toHaveBeenCalled();
    });
  });
});