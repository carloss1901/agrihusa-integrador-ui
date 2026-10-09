import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const esLogin = req.url.endsWith('/api/login');

  if (esLogin) {
    return next(req);
  }

  const token = localStorage
    .getItem('token')
    ?.replace(/["']+/g, '');

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};