import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, tap } from 'rxjs';
import { ApiResponse, Cita, CitaRequest } from '../interfaces/citaI';

@Injectable({
  providedIn: 'root'
})
export class ConexionApiCitas {
  private apiUrl = 'http://localhost:8080/api/citas';
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBdXRoZW50aWNhdGlvbiIsImlzcyI6Imh1ZWxsaXRhcy1jYWxsZWplcmFzLWFwaSIsInJlc2NhdGlzdGFJZCI6ImMxY2I3N2MyLTI0MmUtNDJmNy1iYzUyLTlkZGE5ZGQ5OGY0ZSIsIm5vbWJyZSI6ImFubmUiLCJleHAiOjE3NjY5NjAzMjV9.ydYqQGGYA8DsI29wkTe2mIk0MG8kSLedkzzuWyOqSGc';

  constructor(private http: HttpClient) { 
  }

  obtenerCitas(): Observable<Cita[]> {
   
    return this.http.get<any>(this.apiUrl,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map(response => {
          return response.data || [];
      }),
      
    );
  }

crearCita(cita: CitaRequest): Observable<any> {

  return this.http.post<any>(this.apiUrl, cita, {
    headers: {
      'Authorization': `Bearer ${this.token}`
    }
  }).pipe(
    tap(response => {
      console.log(" Respuesta exitosa de crear cita:", response);
    }),
    catchError((error: HttpErrorResponse) => {
      return throwError(() => new Error(`Error ${error.status}: ${error.message} - ${error.error?.message || ''}`));
    })
  );
}

  getCitaPorId(id: string): Observable<Cita> {
    const url = `${this.apiUrl}/${id}`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.data) {
          return response.data;
        } else if (response.id) {
          return response;
        } else {
          return response;
        }
      }),
      catchError(this.handleError('getCitaPorId'))
    );
  }

  actualizarCita(id: string, cita: Cita): Observable<Cita> {
    console.log("Actualizando cita con ID:", id, "Datos:", cita);
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, cita, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map(response => {
        if (response.data) {
          return response.data;
        } else if (response.id) {
          return response;
        } else {
          return response;
        }
      }),
      catchError(this.handleError('actualizarCita'))
    );
  }

  eliminarCita(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map(response => {
        return;
      }),
      catchError(this.handleError('eliminarCita'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      
      let errorMessage = 'Error desconocido';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Código: ${error.status} - Mensaje: ${error.message}`;
      }
      return throwError(() => new Error(errorMessage));
    };
  }
}