import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, tap } from 'rxjs';
import { ApiResponse, Cita, CitaRequest } from '../interfaces/citaI';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ConexionApiCitas {
    private apiUrl = 'http://localhost:8080/api/citas';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): any {
    console.log('🔧 === CONSTRUYENDO HEADERS ===');
    const token = this.authService.getToken();
    console.log('🔑 Token para headers:', token ? `Presente (${token.length} chars)` : 'AUSENTE');
    
    if (!token) {
      console.warn('⚠️  No hay token disponible para la petición');
      return {};
    }
    
    const headers = { 
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBdXRoZW50aWNhdGlvbiIsImlzcyI6Imh1ZWxsaXRhcy1jYWxsZWplcmFzLWFwaSIsInJlc2NhdGlzdGFJZCI6ImMxY2I3N2MyLTI0MmUtNDJmNy1iYzUyLTlkZGE5ZGQ5OGY0ZSIsIm5vbWJyZSI6ImFubmUiLCJleHAiOjE3NjY5NjAzMjV9.ydYqQGGYA8DsI29wkTe2mIk0MG8kSLedkzzuWyOqSGc`,
      'Content-Type': 'application/json'
    };
    
    console.log('📤 Headers construidos:', headers);
    return headers;
  }

  obtenerCitas(): Observable<Cita[]> {
    console.log('📋 === SOLICITANDO CITAS ===');
    const headers = this.getAuthHeaders();
    
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      tap(response => {
        console.log('✅ Respuesta exitosa de obtenerCitas:');
        console.log('   Estructura completa:', response);
        console.log('   Data recibida:', response.data);
      }),
      map(response => {
        return response.data || [];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en obtenerCitas:');
        console.error('   Status:', error.status);
        console.error('   Status Text:', error.statusText);
        console.error('   URL:', error.url);
        console.error('   Headers de respuesta:', error.headers);
        console.error('   Error completo:', error);
        
        return throwError(() => error);
      })
    );
  }

  crearCita(cita: CitaRequest): Observable<any> {
    console.log('📝 === CREANDO CITA ===');
    console.log('   Datos de cita:', cita);
    const headers = this.getAuthHeaders();

    return this.http.post<any>(this.apiUrl, cita, { headers }).pipe(
      tap(response => {
        console.log("✅ Respuesta exitosa de crear cita:", response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en crearCita:');
        console.error('   Status:', error.status);
        console.error('   Mensaje:', error.message);
        console.error('   Error response:', error.error);
        
        return throwError(() => new Error(`Error ${error.status}: ${error.message} - ${error.error?.message || ''}`));
      })
    );
  }

  getCitaPorId(id: string): Observable<Cita> {
    const url = `${this.apiUrl}/${id}`;
    
    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
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
      catchError(this.handleError('getCitaPorId'))
    );
  }

  actualizarCita(id: string, cita: Cita): Observable<Cita> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, cita, {
      headers: this.getAuthHeaders()
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
      headers: this.getAuthHeaders()
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