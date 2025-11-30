export interface Expediente {
  id: string; // UUID del backend
  nombre: string;
  raza: string;
  especie: string;
  sexo: string;
  edad: number;
  peso: number;
  estado: string;
  urlImagen: string;
  fechaSalida?: string;
  rescatistaId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AnimalRequest {
  peso: number;
  raza: string;
  sexo: string;
  fechaSalida?: string;
  estado: string;
  nombre: string;
  edad: number;
  especie: string;
  urlImagen: string;
  rescatistaId?: string;
}