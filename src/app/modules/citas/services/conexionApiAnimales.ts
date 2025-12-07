import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError } from 'rxjs';
import { Animal } from '../interfaces/animalI';
import { ApiResponse } from '../interfaces/citaI';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConexionApiAnimales {
  private apiUrl = `${environment.apiUrl}/animal`;
    private token = localStorage.getItem('auth_token') || '';

  constructor(private http: HttpClient) { }

  obtenerAnimales(): Observable<Animal[]> {
    console.log("Obteniendo animales desde:", this.apiUrl);
    
    return this.http.get<{success: boolean; data: Animal[]}>(this.apiUrl,{
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(  
      map(response => {
        console.log("Animales obtenidos:", response.data?.length || 0, "animales");
        
        response.data?.forEach(animal => {
          if (animal.urlImage.startsWith('/')) {
            animal.urlImage = `${environment.apiUrlImages}${animal.urlImage}`;
          }
        });

        return response.data || [];
      }),
      catchError(this.handleError('obtenerAnimales'))
    );
  }

  getAnimalPorId(id: string): Observable<Animal> {
    console.log("Obteniendo animal por ID:", id);
    const url = `${this.apiUrl}/${id}`;
    
    return this.http.get<ApiResponse<Animal>>(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map(response => {
        console.log(" Animal encontrado:", response.data);
        return response.data;
      }),
      catchError(this.handleError('getAnimalPorId'))
    );
  }

  buscarAnimales(termino: string): Observable<Animal[]> {
    console.log("Buscando animales con término:", termino);
    const url = `${this.apiUrl}/buscar?nombre=${termino}`;
    
    return this.http.get<ApiResponse<Animal[]>>(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map(response => {
        console.log(" Resultados de búsqueda:", response.data?.length || 0, "animales");
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