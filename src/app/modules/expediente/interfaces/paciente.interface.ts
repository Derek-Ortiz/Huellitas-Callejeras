

export interface Animal {
	id: string;
	nombre: string;
	especie: string;
	raza: string;
	edad: number;
	sexo: string;
	peso: number;
	fechaSalida?: string;
	estado: 'En adopción' | 'Adoptado' | 'En recuperación';
	urlImage: string;
	rescatistaId: string;
}

export interface AnimalRequest {
	nombre: string;
	peso: number;
	especie: string;
	estado: string;
	raza: string;
	fechaSalida?: string;
	edad: number;
	sexo: string;
	rescatistaId: string;
}

export interface AnimalRescateRequest {
	animal: AnimalRequest;
	rescate: RescateRequest;
	imagenFile?: File;
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