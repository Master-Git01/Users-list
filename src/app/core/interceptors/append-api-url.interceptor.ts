import { HttpInterceptorFn } from '@angular/common/http';
import { API_URL } from '../configs/api-url.token';
import { inject } from '@angular/core';

export const appendApiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(API_URL);

  req = req.clone({ url: apiUrl + req.url });

  return next(req);
};
