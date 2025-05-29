import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { authGuard } from './auth.guard';
import { TokenServiceService } from '../services/token-service/token-service.service';

describe('authGuard', () => {
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;
  let tokenServiceSpy: jasmine.SpyObj<TokenServiceService>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    tokenServiceSpy = jasmine.createSpyObj('TokenServiceService', ['getToken', 'deleteToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TokenServiceService, useValue: tokenServiceSpy }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return false and navigate to login if no token is present', (done) => {
    tokenServiceSpy.getToken.and.returnValue(null);

    (executeGuard({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
      done();
    });
  });

  it('should return true if token verification is successful', (done) => {
    tokenServiceSpy.getToken.and.returnValue('valid_token');
    httpSpy.post.and.returnValue(of({ success: true }));

    (executeGuard({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should return false, delete token and navigate to login if token verification fails', (done) => {
    tokenServiceSpy.getToken.and.returnValue('invalid_token');
    httpSpy.post.and.returnValue(throwError(() => new Error('Verification failed')));

    (executeGuard({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBeFalse();
      expect(tokenServiceSpy.deleteToken).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
      done();
    });
  });
});