import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, tap } from 'rxjs';
import { Animal } from '../interfaces/animalI';
import { ApiResponse } from '../interfaces/citaI';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ConexionApiAnimales {
  private apiUrl = 'http://localhost:8080/api/animal';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): any {
    console.log('🔧 === CONSTRUYENDO HEADERS ANIMALES ===');
    const token = this.authService.getToken();
    console.log('🔑 Token para animales:', token ? `Presente (${token.length} chars)` : 'AUSENTE');
    
    const headers = { 
      'Authorization': `Bearer ${token}` 
    };
    console.log('📤 Headers animales:', headers);
    return headers;
  }
  
  obtenerAnimales(): Observable<Animal[]> {
    console.log('🐾 === SOLICITANDO ANIMALES ===');
    console.log("Obteniendo animales desde:", this.apiUrl);
    const headers = this.getAuthHeaders();
    
    return this.http.get<{success: boolean; data: Animal[]}>(this.apiUrl, { headers }).pipe(
      tap(response => {
        console.log('✅ Respuesta exitosa de obtenerAnimales:');
        console.log('   Success:', response.success);
        console.log('   Cantidad de animales:', response.data?.length || 0);
      }),
      map(response => {
        console.log("🐶 Animales procesados:", response.data?.length || 0, "animales");
        return response.data || [];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en obtenerAnimales:');
        console.error('   Status:', error.status);
        console.error('   Status Text:', error.statusText);
        console.error('   URL:', error.url);
        console.error('   Error response:', error.error);
        
        return throwError(() => error);
      })
    );
  }
  getAnimalPorId(id: string): Observable<Animal> {
    console.log("Obteniendo animal por ID:", id);
    const url = `${this.apiUrl}/${id}`;
    
    return this.http.get<ApiResponse<Animal>>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        console.log("Animal encontrado:", response.data);
        return response.data;
      }),
      catchError(this.handleError('getAnimalPorId'))
    );
  }

  buscarAnimales(termino: string): Observable<Animal[]> {
    console.log("Buscando animales con término:", termino);
    const url = `${this.apiUrl}/buscar?nombre=${termino}`;
    
    return this.http.get<ApiResponse<Animal[]>>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        console.log("Resultados de búsqueda:", response.data?.length || 0, "animales");
        return response.data || [];
      }),
      catchError(this.handleError('buscarAnimales'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      console.error(`Error en ${operation}:`, error);
      
      let errorMessage = 'Error desconocido';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
      }
      
      return throwError(() => new Error(errorMessage));
    };
  }
}