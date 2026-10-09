import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token')?.replace(/["']+/g, '');

  const request = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(request).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('token');

        if (router.url !== '/login') {
          void router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};
