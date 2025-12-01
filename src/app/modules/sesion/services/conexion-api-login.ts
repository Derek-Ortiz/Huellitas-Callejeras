import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T | null;
}

export interface RescatistaLogin {
  nombre: string;
  contrasena: string;
}

@Injectable({ providedIn: 'root' })
export class ConexionApiLogin {
  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  login(payload: RescatistaLogin): Observable<any> {
    console.log('Enviando login a:', `${this.apiUrl}/login`, payload);
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/login`, payload).pipe(
      map(res => {
        console.log('Login response:', res);
        return res.data ?? res;
      }),
      catchError(this.handleError('login'))
    );
  }

  createRescatista(nombre: string, contrasena: string): Observable<any> {
    const payload = { nombre, contrasena };
    console.log('Creando rescatista en:', `${this.apiUrl}/crear-rescatista`, payload);
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/crear-rescatista`, payload).pipe(
      map(res => res.data ?? res),
      catchError(this.handleError('createRescatista'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      console.error(`Error en ${operation}:`, error);

      let errorMessage = 'Error desconocido';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Código: ${error.status} - ${error.message}`;
      }

      return throwError(() => new Error(errorMessage));
    };
  }
}
