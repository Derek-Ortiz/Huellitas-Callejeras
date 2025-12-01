import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse, Tratamiento, TratamientoRequest, TratamientoFormRequest } from '../interfaces/tratamientoI';
import { Medicamento } from '../interfaces/medicamentosI';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConexionApiTratamientos {
  private baseUrl = environment.apiUrl;
  private tratamientosUrl = `${this.baseUrl}/tratamientos`;
  private medicamentosUrl = `${this.baseUrl}/medicamentos`;
  
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBdXRoZW50aWNhdGlvbiIsImlzcyI6Imh1ZWxsaXRhcy1jYWxsZWplcmFzLWFwaSIsInJlc2NhdGlzdGFJZCI6IjBjYTMzYzg4LWNhNGUtNGU4Ny05NzI3LTU4YTI0ZGZlNWMzOCIsIm5vbWJyZSI6ImFubmUiLCJleHAiOjE3NjcwNTIwMjl9.LoA5myXHlyihph0wqkorqMvzdI2tjhhq7M2GMBINH-o';

  constructor(private http: HttpClient) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
        'Content-Type': 'application/json'
      })
    };
  }

  obtenerTratamientosPorAnimal(animalId: string): Observable<Tratamiento[]> {
    const url = `${this.tratamientosUrl}/animal/${animalId}`;
    return this.http.get<ApiResponse<Tratamiento[]>>(url, this.headers()).pipe(
      map(response => (response.data || [])),
      catchError(this.handleError('obtenerTratamientosPorAnimal'))
    );
  }

  getMedicamentosByTratamiento(tratamientoId: string): Observable<Medicamento[]> {
    const url = `${this.tratamientosUrl}/${tratamientoId}/medicamentos`;
    return this.http.get<ApiResponse<Medicamento[]>>(url, this.headers()).pipe(
      map(response => response.data || []),
      catchError(this.handleError('getMedicamentosByTratamiento'))
    );
  }

  getTratamientoPorId(id: string): Observable<Tratamiento | null> {
    const url = `${this.tratamientosUrl}/${id}`;
    return this.http.get<ApiResponse<Tratamiento>>(url, this.headers()).pipe(
      map(response => response.data),
      catchError(this.handleError('getTratamientoPorId'))
    );
  }

  crearTratamiento(payload: TratamientoRequest): Observable<Tratamiento> {
    const url = `${this.tratamientosUrl}`;
    return this.http.post<ApiResponse<Tratamiento>>(url, payload, this.headers()).pipe(
      map(response => {
        const t = response.data as any;
        return {
          ...t,
        } as Tratamiento;
      }),
      catchError(this.handleError('crearTratamiento'))
    );
  }

  crearTratamientoFormData(tratamiento: TratamientoFormRequest, archivo?: File): Observable<Tratamiento> {
    const url = `${this.tratamientosUrl}`;
    const form = new FormData();
    form.append('tratamiento', JSON.stringify(tratamiento));
    if (archivo) { form.append('archivo', archivo); }
   
    console.log('[API] FormData keys antes de POST /tratamientos:');
    for (const key of form.keys()) {
      console.log('  -', key, key === 'tratamiento' ? '(JSON length=' + (form.get(key) as string)?.length + ')' : '');
    }
    const headers = this.headers();
   
    (headers.headers as HttpHeaders) = headers.headers.delete('Content-Type');
    return this.http.post<ApiResponse<Tratamiento>>(url, form, headers).pipe(
      map(r => r.data),
      catchError(this.handleError('crearTratamientoFormData'))
    );
  }

  actualizarTratamientoFormData(id: string, tratamiento: TratamientoFormRequest, archivo?: File): Observable<Tratamiento> {
    const url = `${this.tratamientosUrl}/${id}`;
    const form = new FormData();
    form.append('tratamiento', JSON.stringify(tratamiento));
    if (archivo) { form.append('archivo', archivo); }
    console.log('[API] PUT FormData keys /tratamientos/' + id + ':');
    for (const key of form.keys()) {
      console.log('  -', key);
    }
    const headers = this.headers();
    (headers.headers as HttpHeaders) = headers.headers.delete('Content-Type');
    return this.http.put<ApiResponse<Tratamiento>>(url, form, headers).pipe(
      map(r => r.data),
      catchError(this.handleError('actualizarTratamientoFormData'))
    );
  }

  actualizarTratamiento(id: string, payload: Partial<Tratamiento>): Observable<Tratamiento> {
    const url = `${this.tratamientosUrl}/${id}`;
    return this.http.put<ApiResponse<Tratamiento>>(url, payload, this.headers()).pipe(
      map(response => response.data),
      catchError(this.handleError('actualizarTratamiento'))
    );
  }

  eliminarTratamiento(id: string): Observable<boolean> {
    const url = `${this.tratamientosUrl}/${id}`;
    return this.http.delete<ApiResponse<null>>(url, this.headers()).pipe(
      map(response => response.success),
      catchError(this.handleError('eliminarTratamiento'))
    );
  }

  listarMedicamentos(): Observable<Medicamento[]> {
    const url = `${this.medicamentosUrl}`;
    return this.http.get<ApiResponse<Medicamento[]>>(url, this.headers()).pipe(
      map(response => response.data || []),
      catchError(this.handleError('listarMedicamentos'))
    );
  }

  crearMedicamento(payload: Omit<Medicamento, 'id'>): Observable<Medicamento> {
    const url = `${this.medicamentosUrl}`;
    console.log('[API] POST /medicamentos payload:', payload);
    return this.http.post<ApiResponse<Medicamento>>(url, payload, this.headers()).pipe(
      map(response => response.data),
      catchError(this.handleError('crearMedicamento'))
    );
  }

  actualizarMedicamento(id: string, payload: Partial<Medicamento>): Observable<Medicamento> {
    const url = `${this.medicamentosUrl}/${id}`;
    return this.http.put<ApiResponse<Medicamento>>(url, payload, this.headers()).pipe(
      map(response => response.data),
      catchError(this.handleError('actualizarMedicamento'))
    );
  }

  eliminarMedicamento(id: string): Observable<boolean> {
    const url = `${this.medicamentosUrl}/${id}`;
    return this.http.delete<ApiResponse<null>>(url, this.headers()).pipe(
      map(response => response.success),
      catchError(this.handleError('eliminarMedicamento'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      let msg = `Error en ${operation}`;
      if (error.error && error.error.message) {
        msg += `: ${error.error.message}`;
      } else {
        msg += `: Código ${error.status} - ${error.message}`;
      }
      return throwError(() => new Error(msg));
    };
  }
}
