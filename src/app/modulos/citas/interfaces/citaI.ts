export interface Cita {
  id: string;
  titulo: string;
  fechaCita: string;
  lugar: string;
  motivo: string;
  fechaRealizacion: string;
  animalitoId: string;
}

export interface CitaRequest {
  fechaRealizacion: string;
  fechaCita: string;
  titulo: string;
  motivo: string;
  lugar: string;
  animalitoId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}