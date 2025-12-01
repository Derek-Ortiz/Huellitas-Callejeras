import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Animal } from '../interfaces/animalI';
import { ApiResponse } from '../interfaces/tratamientoI';

@Injectable({ providedIn: 'root' })
export class ConexionApiAnimales {
  private baseUrl = 'http://localhost:9090/api';
  private animalesUrl = `${this.baseUrl}/animales`;
  private token = '';

  constructor(private http: HttpClient) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
        'Content-Type': 'application/json'
      })
    };
  }

  crearAnimal(payload: Omit<Animal, 'id' | 'fechaSalida'> & { fechaSalida?: string | null }): Observable<Animal> {
    return this.http.post<ApiResponse<Animal>>(this.animalesUrl, payload, this.headers()).pipe(
      map(r => r.data),
      catchError(this.handleError('crearAnimal'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      const msg = error.error?.message ? error.error.message : `Código ${error.status} - ${error.message}`;
      return throwError(() => new Error(`Error en ${operation}: ${msg}`));
    };
  }
}