import { Injectable } from '@angular/core';

/**
 * Local Paciente interface to match the shape expected by the mock.
 * This avoids importing a non-exported symbol from ../interfaces/paciente.interface.
 */
interface Paciente {
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
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteServiceMock {
  private paciente: Paciente = {
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    sexo: '',
    peso: '',
    fechaIngreso: '',
    fechaSalida: '',
    lugar: '',
    descripcion: '',
    estado: 'No adoptado'
  };

  getPaciente(): Paciente {
    return this.paciente;
  }

  updatePaciente(data: Partial<Paciente>) {
    this.paciente = { ...this.paciente, ...data };
  }
}
