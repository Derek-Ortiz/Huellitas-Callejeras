import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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
    console.log('[ExpedientesService] Obteniendo expedientes...');
    console.log(' URL:', this.apiUrl);
    
    return this.http.get<ApiResponse<Expediente[]>>(this.apiUrl).pipe(
      tap(response => {
        console.log('[ExpedientesService] Respuesta completa del backend:', response);
        console.log('Success:', response.success);
        console.log('Cantidad de expedientes:', response.data?.length || 0);
        
        if (response.success && response.data) {
          response.data.forEach((expediente, index) => {
            if(expediente.urlImage.startsWith('/') ){
              expediente.urlImage =  `${environment.apiUrlImages}${expediente.urlImage}`;
            }
            console.log(`Expediente ${index + 1}:`, {
              id: expediente.id,
              nombre: expediente.nombre,
              raza: expediente.raza,
              urlImage: expediente.urlImage,
              tieneImagen: !!expediente.urlImage,
              urlCompleta: expediente.urlImage ? (expediente.urlImage.startsWith('/') ? `${environment.apiUrlImages}${expediente.urlImage}` : expediente.urlImage) : 'Sin imagen',
              tipoImagen: expediente.urlImage ? this.getImageType(expediente.urlImage) : 'Sin imagen'
              
            });
          });
        }
      }),
      map(response => {
        if (response.success && response.data) {
          console.log('[ExpedientesService] Retornando datos procesados');
          return response.data;
        }
        console.warn('[ExpedientesService] No hay datos o success=false');
        return [];
      }),
      catchError(this.handleError)
    );
  }

  // DELETE /animal/{id} - Eliminar animal
  eliminarExpediente(id: string): Observable<boolean> {
    console.log('[ExpedientesService] Eliminando expediente ID:', id);
    console.log('URL DELETE:', `${this.apiUrl}/${id}`);
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        console.log('[ExpedientesService] Respuesta de eliminación:', response);
      }),
      map(response => {
        if (response.success) {
          console.log('[ExpedientesService] Expediente eliminado exitosamente');
          return true;
        } else {
          console.warn('[ExpedientesService] No se pudo eliminar el expediente:', response.message);
          return false;
        }
      }),
      catchError(this.handleError)
    );
  }

  // GET /animal/{id} - Obtener un animal por ID
  obtenerExpedientePorId(id: string): Observable<Expediente | undefined> {
    console.log(`[ExpedientesService] Obteniendo expediente por ID: ${id}`);
    return this.http.get<ApiResponse<Expediente>>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        console.log('[ExpedientesService] Respuesta por ID:', response);
        if (response.success && response.data) {
          console.log('Imagen del expediente:', {
            urlImage: response.data.urlImage,
            tipo: this.getImageType(response.data.urlImage),
            existe: !!response.data.urlImage
          });
        }
      }),
      map(response => response.success ? response.data : undefined),
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

  // Método auxiliar para identificar tipo de imagen
  private getImageType(url: string): string {
    if (!url) return 'URL vacía';
    
    if (url.startsWith('http')) return 'URL absoluta';
    if (url.startsWith('/')) return `${this.apiUrl}${url}`;
    if (url.startsWith('data:')) return 'Base64';
    if (url.startsWith('assets/')) return 'Assets local';
    if (url.startsWith('./')) return 'URL relativa';
    

    return 'URL desconocida';
  }

  private handleError(error: any): Observable<never> {
    console.error('[ExpedientesService] Error:', error);
    
    let errorMessage = 'Ocurrió un error en el servidor';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    } else if (error.status === 401) {
      errorMessage = 'Token de autenticación inválido o expirado';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos para acceder a este recurso';
    }
    
    console.error('Mensaje de error final:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}