import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Expediente, ApiResponse, AnimalRequest } from '../interfaces/expediente.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpedientesService {
  private apiUrl = `${environment.apiUrl}/animal`;

  constructor(private http: HttpClient) { }

  // GET /animal - Obtener todos los animales
  obtenerExpedientes(): Observable<Expediente[]> {
    return this.http.get<ApiResponse<Expediente[]>>(this.apiUrl).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      }),
      catchError(this.handleError)
    );
  }

  // GET /animal/{id} - Obtener un animal por ID
  obtenerExpedientePorId(id: string): Observable<Expediente | undefined> {
    return this.http.get<ApiResponse<Expediente>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.success ? response.data : undefined),
      catchError(this.handleError)
    );
  }

  // GET /animal/estado/{estado} - Filtrar por estado
  obtenerExpedientesPorEstado(estado: string): Observable<Expediente[]> {
    return this.http.get<ApiResponse<Expediente[]>>(`${this.apiUrl}/estado/${estado}`).pipe(
      map(response => response.success && response.data ? response.data : []),
      catchError(this.handleError)
    );
  }

  // POST /animal - Crear nuevo animal
  agregarExpediente(expediente: AnimalRequest): Observable<Expediente> {
    return this.http.post<ApiResponse<Expediente>>(this.apiUrl, expediente).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError)
    );
  }

  // PUT /animal/{id} - Actualizar animal
  actualizarExpediente(id: string, expediente: AnimalRequest): Observable<boolean> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, expediente).pipe(
      map(response => response.success),
      catchError(this.handleError)
    );
  }

  // DELETE /animal/{id} - Eliminar animal
  eliminarExpediente(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.success),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en ExpedientesService:', error);
    let errorMessage = 'Ocurrió un error en el servidor';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}