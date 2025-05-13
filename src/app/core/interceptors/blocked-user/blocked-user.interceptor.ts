import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { UserService } from '../../services/user/user.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const BlockedUserInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const userService = inject(UserService);

  let isCurrentlyBlocked = false;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 429) {
        if (!isCurrentlyBlocked) {
          isCurrentlyBlocked = true;
          userService.setUserBlocked();

        }
        
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};

export function timeBlocked(userService: UserService, notificationService: NotificationService) {

  notificationService.show({
    type: 'timeline',
    position: 'tr',
    isError: true,
    text: 'You have performed too many actions.Your account is temporarily blocked.',
    duration: 60000,
  });

  setTimeout(() => {
    userService.unblockUser().subscribe();
  }, 60000);
};