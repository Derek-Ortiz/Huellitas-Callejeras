export interface Paciente {
  id?: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  sexo: string;
  peso: string;
  fechaIngreso: string;
  fechaSalida: string;
  lugar: string;
  descripcion: string;
  estado: 'No adoptado' | 'Adoptado' | 'En tratamiento';
}
