import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { of, throwError, Observable } from 'rxjs';
import { BlockedUserInterceptor, timeBlocked } from './blocked-user.interceptor';
import { NotificationService } from '../../services/notification/notification.service';
import { UserService } from '../../services/user/user.service';

describe('BlockedUserInterceptor', () => {
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let nextHandler: HttpHandlerFn;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['setUserBlocked', 'unblockUser']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ]
    });

    nextHandler = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      return of({} as HttpEvent<any>);
    };
  });

  it('should be created', () => {
    expect(BlockedUserInterceptor).toBeTruthy();
  });

  it('should call setUserBlocked and return error on 429 status', (done) => {
    const errorResponse = new HttpErrorResponse({ status: 429 });
    const req = new HttpRequest('GET', '/test');
    nextHandler = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      return throwError(() => errorResponse);
    };

    BlockedUserInterceptor(req, nextHandler).subscribe({
      next: () => fail('should have caught the error'),
      error: (error) => {
        expect(error).toBe(errorResponse);
        expect(userServiceSpy.setUserBlocked).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should not call setUserBlocked if not 429 status', (done) => {
    const errorResponse = new HttpErrorResponse({ status: 400 });
    const req = new HttpRequest('GET', '/test');
    nextHandler = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      return throwError(() => errorResponse);
    };

    BlockedUserInterceptor(req, nextHandler).subscribe({
      next: () => fail('should have caught the error'),
      error: (error) => {
        expect(error).toBe(errorResponse);
        expect(userServiceSpy.setUserBlocked).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should only call setUserBlocked once for consecutive 429 statuses', (done) => {
    const errorResponse = new HttpErrorResponse({ status: 429 });
    const req = new HttpRequest('GET', '/test');
    
    let firstCall = true;
    nextHandler = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      if (firstCall) {
        firstCall = false;
        return throwError(() => errorResponse);
      }
      return throwError(() => errorResponse);
    };

    BlockedUserInterceptor(req, nextHandler).subscribe({
      next: () => {},
      error: () => {
        BlockedUserInterceptor(req, nextHandler).subscribe({
          next: () => {},
          error: () => {
            expect(userServiceSpy.setUserBlocked).toHaveBeenCalledTimes(1);
            done();
          }
        });
      }
    });
  });
});

describe('timeBlocked', () => {
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['unblockUser']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['show']);
    jasmine.clock().install(); 
  });

  afterEach(() => {
    jasmine.clock().uninstall(); 
  });

  it('should show notification and unblock user after 60 seconds', () => {
    userServiceSpy.unblockUser.and.returnValue(of(null)); 

    timeBlocked(userServiceSpy, notificationServiceSpy);

    expect(notificationServiceSpy.show).toHaveBeenCalledWith(jasmine.objectContaining({
      type: 'timeline',
      isError: true,
      text: 'You have performed too many actions.Your account is temporarily blocked.',
      duration: 60000,
    }));
    
    expect(userServiceSpy.unblockUser).not.toHaveBeenCalled();

    jasmine.clock().tick(60000); 

    expect(userServiceSpy.unblockUser).toHaveBeenCalled();
  });
});