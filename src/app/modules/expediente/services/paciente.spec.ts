import { Injectable } from '@angular/core';
import { Paciente } from '../interfaces/paciente.interface';

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
