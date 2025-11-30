
import { Medicamento } from './medicamentosI';

export interface Tratamiento {
  id: string; 
  fechaInicio: string; 
  receta?: string | null; 
  animalId: string; 
  medicamentos: Medicamento[];  
}

export interface TratamientoRequest {
  fechaInicio: string; 
  animalId: string; 
  medicamentos: Medicamento[];  
}

export interface TratamientoFormRequest {
  animalId: string;
  fechaInicio: string; 
  medicamentos: Array<{
    medicamentoId: string;
    dosis: number;
    repeticion: number; 
    fechaConclusion: string; 
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}