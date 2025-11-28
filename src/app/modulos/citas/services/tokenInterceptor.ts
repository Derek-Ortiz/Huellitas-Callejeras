import { Injectable } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { CanActivateFn } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔄 === INTERCEPTOR ACTIVADO ===');
  console.log('🌐 URL de la petición:', req.url);
  console.log('📋 Método:', req.method);
  
  const token = localStorage.getItem('token');
  console.log('🔑 Token en interceptor:', token ? `Presente (${token.length} chars)` : 'NO HAY TOKEN');

  if (token) {
    // Verificar formato antes de usar
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('❌ Token con formato inválido en interceptor');
    } else {
      console.log('✅ Token con formato JWT válido en interceptor');
    }
    
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('📤 Headers de la petición:');
    console.log('   Authorization:', authReq.headers.get('Authorization'));
    
    return next(authReq).pipe(
      tap(response => {
        console.log('✅ Respuesta exitosa para:', req.url);
      }),
      catchError(error => {
        console.error('❌ Error en petición:', req.url);
        console.error('   Status:', error.status);
        console.error('   Message:', error.message);
        return throwError(() => error);
      })
    );
  } else {
    console.warn('⚠️  Petición sin token:', req.url);
    return next(req);
  }
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        console.error('🚫 ERROR 401 - Token inválido o expirado');
        console.error('   URL:', err.url);
        console.error('   Detalles:', err);
        
        // Limpiar token inválido
        localStorage.removeItem('token');
        console.log('🗑️  Token removido de localStorage');
      }
      return throwError(() => err);
    })
  );
};

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');
  console.log('🛡️  AuthGuard ejecutado, token presente:', !!token);
  return !!token;
};