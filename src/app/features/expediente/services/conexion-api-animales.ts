import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Animal {
	id: string;
	nombre: string;
	especie: string;
	raza: string;
	edad: string;
	sexo: string;
	peso: string;
	fechaSalida?: string;
	estado: 'En adopción' | 'Adoptado' | 'En recuperación';
	urlImage: string;
	rescatistaId: string;
}


/** "animal": {
            "id": "7ac8f13b-2d9f-47c4-9958-a0cd4e9c1b7e",
            "nombre": "michito11",
            "peso": 15.5,
            "raza": "Mestizo",
            "sexo": "Macho",
            "edad": 2,
            "especie": "Perro",
            "estado": "En recuperación",
            "urlImage": "https://amzn-s3-huellitas-callejeras1.s3.us-east-1.amazonaws.com/animals/b9b77775-923c-493d-8b58-d23a9fea87cc.jpg",
            "rescatistaId": "b6d2aa7f-b8a1-44bd-8478-f09e0f8c1306"
        },
        "rescate": {
            "id": "ac7ab169-b5e3-4b72-8c68-309dce538e21",
            "fechaIngreso": "2025-11-30T02:29:55.925779Z",
            "lugar": "Parque Central",
            "descripcion": "Encontrado abandonado",
            "animalId": "7ac8f13b-2d9f-47c4-9958-a0cd4e9c1b7e"
        } */

export interface AnimalRequest {
	nombre: string;
	peso: string;
	especie: string;
	estado: string;
	raza: string;
	fechaSalida?: string;
	edad: string;
	sexo: string;
	rescatistaId: string;
}

export interface AnimalRescateRequest {
	animal: AnimalRequest;
	rescate: RescateRequest;
}

export interface RescateResponse {
	id: string;
	fechaIngreso: string;
	lugar: string;
	descripcion: string;
	animalId: string;

}

export interface RescateRequest{
	lugar: string;
	descripcion: string;
}

export interface ApiResponse<T = any> {
	success: boolean;
	message?: string;
	data?: T 
}

@Injectable({ providedIn: 'root' })
export class ConexionApiAnimales {
	private apiUrl = 'http://localhost:8080/api/animal';

	constructor(private http: HttpClient) {}

	obtenerAnimales(page?: number, size?: number): Observable<Animal[]> {
		console.log('🔄 Obteniendo animales desde:', this.apiUrl);
		let params = new HttpParams();
		if (page != null) params = params.set('page', String(page));
		if (size != null) params = params.set('size', String(size));

		return this.http.get<ApiResponse<Animal[]>>(this.apiUrl, { params }).pipe(
			map(response => {
				console.log('✅ Animales obtenidos:', response.data?.length || 0, 'animales');
				return response.data || [];
			}),
			catchError(this.handleError('obtenerAnimales'))
		);
	}

	getAnimalPorId(id: string): Observable<Animal | null> {
		console.log('🔄 Obteniendo animal por ID:', id);
		const url = `${this.apiUrl}/${encodeURIComponent(id)}`;
		return this.http.get<ApiResponse<any>>(url).pipe(
			map(response => {
				console.log('✅ Animal encontrado (raw):', response.data);
				// Si la API devuelve { data: { animal, rescate } } unimos ambos objetos
				const data = response.data;
				if (!data) return null;
				if (data.animal) {
					const animal = data.animal as any;
					const rescate = data.rescate as any || {};
					const merged = { ...animal, ...rescate } as Animal;
					console.log('🔎 getAnimalPorId merged animal:', merged);
					return merged;
				}
				// Si data ya es el animal plano
				return data as Animal;
			}),
			catchError(this.handleError('getAnimalPorId'))
		);
	}

	/**
	 * Sube una imagen asociada a un animal (asume endpoint POST {apiUrl}/{id}/upload)
	 * El backend debe aceptar multipart/form-data con campo `file`.
	 */
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
		console.log('🔄 Filtrando animales por estado:', estado);
		const url = `${this.apiUrl}/estado/${encodeURIComponent(estado)}`;
		return this.http.get<ApiResponse<Animal[]>>(url).pipe(
			map(response => response.data || []),
			catchError(this.handleError('getPorEstado'))
		);
	}

	crearAnimal(payload: Partial<Animal>): Observable<Animal | null> {
		console.log('🔄 Creando animal:', payload);
		return this.http.post<ApiResponse<Animal>>(this.apiUrl, payload).pipe(
			map(res => res.data ?? ({} as Animal)),
			catchError(this.handleError('crearAnimal'))
		);
	}

	actualizarAnimal(id: string, payload: Partial<Animal>): Observable<boolean> {
		console.log('🔄 Actualizando animal', id, payload);
		const url = `${this.apiUrl}/${encodeURIComponent(id)}`;
		return this.http.put<ApiResponse<any>>(url, payload).pipe(
			map(res => !!res.success),
			catchError(this.handleError('actualizarAnimal'))
		);
	}

	eliminarAnimal(id: string): Observable<boolean> {
		console.log('🔄 Eliminando animal ID:', id);
		const url = `${this.apiUrl}/${encodeURIComponent(id)}`;
		return this.http.delete<ApiResponse<any>>(url).pipe(
			map(res => !!res.success),
			catchError(this.handleError('eliminarAnimal'))
		);
	}

	buscarAnimales(termino: string): Observable<Animal[]> {
		console.log('🔄 Buscando animales con término:', termino);
		const url = `${this.apiUrl}/buscar`;
		let params = new HttpParams().set('nombre', termino);
		return this.http.get<ApiResponse<Animal[]>>(url, { params }).pipe(
			map(res => res.data || []),
			catchError(this.handleError('buscarAnimales'))
		);
	}

	crearConRescate(payload: AnimalRescateRequest): Observable<any | null> {
		console.log('🔄 Creando animal con rescate', payload);
		const url = `${this.apiUrl}/crear-con-rescate`;
		return this.http.post<ApiResponse<any>>(url, payload).pipe(
			map(res => res.data ?? {}),
			catchError(this.handleError('crearConRescate'))
		);
	}

	actualizarConRescate(id: string, payload: AnimalRescateRequest): Observable<any | null> {
		console.log('🔄 Actualizando animal con rescate', id, payload);
		const url = `${this.apiUrl}/${encodeURIComponent(id)}/actualizar-con-rescate`;
		return this.http.put<ApiResponse<any>>(url, payload).pipe(
			map(res => res.data ?? {}),
			catchError(this.handleError('actualizarConRescate'))
		);
	}

	/** Enviar multipart/form-data para crear con rescate y archivo de imagen */
	crearConRescateFormData(payload: AnimalRescateRequest, file?: File): Observable<any | null> {
    const url = `${this.apiUrl}/crear-con-rescate`;
    const fd = new FormData();

    // 1. Obtener y loguear el ID del rescatista
    const localIdRescatista = localStorage.getItem('id_rescatista');
    
    // Asignación de rescatistaId (prioridad: payload > localStorage > undefined)
    payload.animal.rescatistaId = payload.animal.rescatistaId ?? localIdRescatista ?? undefined;
    
    console.group('🛠️ Debugging: crearConRescateFormData');
    console.log('🔗 URL de la solicitud:', url);
    console.log('ℹ️ rescatistaId obtenido (localStorage):', localIdRescatista);
    console.log('✅ rescatistaId FINAL asignado a payload.animal:', payload.animal.rescatistaId);
    
    // 2. Adjuntar los datos al FormData y loguear los JSON
    const animalJson = JSON.stringify(payload.animal, null, 2); // Formato JSON legible
    const rescateJson = JSON.stringify(payload.rescate, null, 2); // Formato JSON legible

    fd.append('animal', animalJson);
    fd.append('rescate', rescateJson);
    
    console.log('📋 Contenido del JSON "animal":', animalJson);
    console.log('📋 Contenido del JSON "rescate":', rescateJson);

    if (file) {
        fd.append('imagen', file, file.name);
        console.log(`🖼️ Archivo adjuntado: ${file.name} (Tipo: ${file.type}, Tamaño: ${file.size} bytes)`);
    } else {
        console.log('❌ No se adjuntó archivo de imagen (file es null o undefined).');
    }

    // 3. LOG FINAL: Listar todas las entradas de FormData para verificación
    console.groupCollapsed('📦 Entradas completas de FormData');
    try {
        for (const entry of fd.entries()) {
            const [key, value] = entry as [string, any];
            if (value instanceof File) {
                console.log(`FormData entry -> **${key}**: File(name=${value.name}, type=${value.type}, size=${value.size})`);
            } else {
                // Para las entradas 'animal' y 'rescate', mostrar la clave y el contenido JSON como texto
                console.log(`FormData entry -> **${key}**:`, value); 
            }
        }
    } catch (e) {
        console.warn('⚠️ No se pudo listar FormData entries (Error del navegador o polyfill faltante):', e);
    }
    console.groupEnd(); // Cierra 'Entradas completas de FormData'
    console.groupEnd(); // Cierra 'Debugging: crearConRescateFormData'

    // 4. Ejecutar la solicitud HTTP
    return this.http.post<ApiResponse<any>>(url, fd).pipe(
        map(res => res.data ?? {}),
        catchError(this.handleError('crearConRescateFormData'))
    );
}

	/** Enviar multipart/form-data para actualizar con rescate y archivo de imagen */
	actualizarConRescateFormData(id: string, payload: AnimalRescateRequest, file?: File): Observable<any | null> {
		const url = `${this.apiUrl}/${encodeURIComponent(id)}/actualizar-con-rescate`;
		const fd = new FormData();
		fd.append('animal', JSON.stringify(payload.animal));
		fd.append('rescate', JSON.stringify(payload.rescate));
		if (file) fd.append('imagen', file, file.name);
		return this.http.put<ApiResponse<any>>(url, fd).pipe(
			map(res => res.data ?? {}),
			catchError(this.handleError('actualizarConRescateFormData'))
		);
	}

	getConRescate(id: string): Observable<any | null> {
		console.log('🔄 Obteniendo animal con rescate ID:', id);
		const url = `${this.apiUrl}/${encodeURIComponent(id)}/con-rescate`;
		return this.http.get<ApiResponse<any>>(url).pipe(
			map(res => res.data ?? {}),
			catchError(this.handleError('getConRescate'))
		);
	}

	private handleError(operation: string) {
		return (error: HttpErrorResponse) => {
			console.error(`❌ Error en ${operation}:`, error);

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

