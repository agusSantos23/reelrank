import { HttpClient } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { TokenServiceService } from '../services/token-service/token-service.service';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const tokenService = inject(TokenServiceService);
  const token = tokenService.getToken();
  const apiUrl = environment.apiUrl; 

  if (!token) {
    router.navigate(['/auth/login']);
    return of(false);
  }

  return http.post<any>(`${apiUrl}/auth/verify-token`, { token }).pipe(
    tap(() => {
      
      return true;
      
    }),
    catchError((error) => {

      console.error('Token verification failed', error);
      tokenService.deleteToken(); 
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};