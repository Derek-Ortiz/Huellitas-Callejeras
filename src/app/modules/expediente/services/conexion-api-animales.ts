import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Animal, ApiResponse, RescateRequest, RescateResponse, AnimalRequest, AnimalRescateRequest} from '../interfaces/paciente.interface';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConexionApiAnimales {
	private apiUrl = environment.apiUrl + '/animal';

	constructor(private http: HttpClient) {}

	obtenerAnimales(page?: number, size?: number): Observable<Animal[]> {
		let params = new HttpParams();
		if (page != null) params = params.set('page', String(page));
		if (size != null) params = params.set('size', String(size));

		return this.http.get<ApiResponse<Animal[]>>(this.apiUrl, { params }).pipe(
			map(response => response.data || []),
			catchError(this.handleError('obtenerAnimales'))
		);
	}

	getAnimalPorId(id: string): Observable<Animal | null> {
		const url = `${this.apiUrl}/${encodeURIComponent(id)}`;
		return this.http.get<ApiResponse<any>>(url).pipe(
			map(response => {
				const data = response.data;
				if (!data) return null;
				if (data.animal) {
					const animal = data.animal as any;
					const rescate = data.rescate as any || {};
					const merged = { ...animal, ...rescate } as Animal;
					return merged;
				}
				return data as Animal;
			}),
			catchError(this.handleError('getAnimalPorId'))
		);
	}

	uploadImage(id: string, file: File): Observable<boolean> {
		const url = `${this.apiUrl}/${encodeURIComponent(id)}/upload`;
		const fd = new FormData();
		fd.append('file', file);
		return this.http.post<ApiResponse<any>>(url, fd).pipe(
			map(res => !!res.success),
			catchError(this.handleError('uploadImage'))
		);
	}

	getPorEstado(estado: string): Observable<Animal[]> {
		const url = `${this.apiUrl}/estado/${encodeURIComponent(estado)}`;
		return this.http.get<ApiResponse<Animal[]>>(url).pipe(
			map(response => response.data || []),
			catchError(this.handleError('getPorEstado'))
		);
	}

	crearAnimal(payload: Partial<Animal>): Observable<Animal | null> {
		return this.http.post<ApiResponse<Animal>>(this.apiUrl, payload).pipe(
			map(res => res.data ?? ({} as Animal)),
			catchError(this.handleError('crearAnimal'))
		);
	}

	actualizarAnimal(id: string, payload: Partial<Animal>): Observable<boolean> {
		const url = `${this.apiUrl}/${encodeURIComponent(id)}`;
		return this.http.put<ApiResponse<any>>(url, payload).pipe(
			map(res => !!res.success),
			catchError(this.handleError('actualizarAnimal'))
		);
	}

	eliminarAnimal(id: string): Observable<boolean> {
		const url = `${this.apiUrl}/${encodeURIComponent(id)}`;
		return this.http.delete<ApiResponse<any>>(url).pipe(
			map(res => !!res.success),
			catchError(this.handleError('eliminarAnimal'))
		);
	}

	buscarAnimales(termino: string): Observable<Animal[]> {
		const url = `${this.apiUrl}/buscar`;
		let params = new HttpParams().set('nombre', termino);
		return this.http.get<ApiResponse<Animal[]>>(url, { params }).pipe(
			map(res => res.data || []),
			catchError(this.handleError('buscarAnimales'))
		);
	}

	crearConRescate(payload: AnimalRescateRequest): Observable<any | null> {
		const url = `${this.apiUrl}/crear-con-rescate`;
		return this.http.post<ApiResponse<any>>(url, payload).pipe(
			map(res => res.data ?? {}),
			catchError(this.handleError('crearConRescate'))
		);
	}

	actualizarConRescate(id: string, payload: AnimalRescateRequest): Observable<any | null> {
		const url = `${this.apiUrl}/${encodeURIComponent(id)}/actualizar-con-rescate`;
		return this.http.put<ApiResponse<any>>(url, payload).pipe(
			map(res => res.data ?? {}),
			catchError(this.handleError('actualizarConRescate'))
		);
	}

	private normalizarSexoPorContenido(sexo: string): string {
		if (!sexo) return 'Macho';
		
		const sexoLower = sexo.toLowerCase();
		
		if (sexoLower.includes('m')) {
			return 'Macho';
		}
		
		return 'Hembra';
	}

	/**
	 * POST crear animal con rescate (FormData)
	 * Endpoint: http://127.0.0.1:9090/api/animal/crear-con-rescate
	 *
	 * Partes del FormData:
	 *  - "animal": JSON string con los datos del animal
	 *  - "rescate": JSON string con los datos de rescate
	 *  - "imagen" (opcional): archivo de imagen seleccionado en el formulario
	 *
	 * Nota: si deseas probar sin enviar archivo, puedes comentar el bloque
	 * fd.append('imagen', file, file.name) más abajo.
	 */
	crearConRescateFormData(payload: AnimalRescateRequest, file?: File): Observable<any | null> {
		const url = `${this.apiUrl}/crear-con-rescate`;
		const fd = new FormData();

		const localIdRescatista = localStorage.getItem('id_rescatista');
		const sexoNormalizado = this.normalizarSexoPorContenido(payload.animal.sexo);
		
		payload.animal.rescatistaId = localIdRescatista || 'no encontrado';

		const animalData = {
			...payload.animal,
			peso: Number(payload.animal.peso),
			edad: Number(payload.animal.edad),
			sexo: sexoNormalizado
		};

		const animalJson = JSON.stringify(animalData);
		const rescateJson = JSON.stringify(payload.rescate);

		fd.append('animal', animalJson);
		fd.append('rescate', rescateJson);
		
		if (file) {
			// Parte de archivo para el endpoint http://127.0.0.1:9090/api/animal/crear-con-rescate
			// Descomentar/comentar esta línea para habilitar/deshabilitar el envío del archivo.
			fd.append('imagen', file, file.name);
		}

		return this.http.post<ApiResponse<any>>(url, fd).pipe(
			map(res => res.data ?? {}),
			catchError(this.handleError('crearConRescateFormData'))
		);
	}

	actualizarConRescateFormData(id: string, payload: AnimalRescateRequest, file?: File): Observable<any | null> {
		console.log('Actualizando con rescate - ID:', id, 'Payload:', payload, 'Archivo:', file);
		const url = `${this.apiUrl}/${encodeURIComponent(id)}/actualizar-con-rescate`;
		const fd = new FormData();
		
		const animalData = {
			...payload.animal,
			peso: Number(payload.animal.peso),
			edad: Number(payload.animal.edad),
			fechaSalida: payload.animal.fechaSalida ?? 'no ta',
		};

		const rescateData = {
			lugar: payload.rescate.lugar,
			descripcion: payload.rescate.descripcion
		};
		console.log('Datos normalizados - Animal:', animalData, 'Rescate:', rescateData);
		fd.append('animal', JSON.stringify(animalData));
		fd.append('rescate', JSON.stringify(rescateData));
		
		if (file) {
			fd.append('imagen', file, file.name);
		}

		return this.http.put<ApiResponse<any>>(url, fd).pipe(
			map(res => res.data ?? {}),
			catchError(this.handleError('actualizarConRescateFormData'))
		);
	}

	getConRescate(id: string): Observable<any | null> {
		const url = `${this.apiUrl}/${encodeURIComponent(id)}/con-rescate`;
		return this.http.get<ApiResponse<any>>(url).pipe(
			map(res => res.data ?? {}),
			catchError(this.handleError('getConRescate'))
		);
	}

	private handleError(operation: string) {
		return (error: HttpErrorResponse) => {
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