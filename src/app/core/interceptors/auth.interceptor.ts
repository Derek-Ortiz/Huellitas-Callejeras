import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private tokenKey = 'auth_token';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        // Evitar añadir el header en endpoints de autenticación
        const isAuthEndpoint = /\/auth(\/login|\/crear-rescatista)/.test(req.url);
        if (!isAuthEndpoint) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(cloned);
        }
      }
    } catch (e) {
      console.warn('AuthInterceptor: error leyendo token de localStorage', e);
    }

    return next.handle(req);
  }
}
