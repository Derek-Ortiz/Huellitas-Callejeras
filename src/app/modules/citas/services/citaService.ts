import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cita } from '../../../modules/citas/interfaces/citaI';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private citasSource = new BehaviorSubject<Cita[]>([]);
  citas$ = this.citasSource.asObservable();

  private fechaSeleccionadaSource = new BehaviorSubject<string | null>(null);
  fechaSeleccionada$ = this.fechaSeleccionadaSource.asObservable();

  agregarCita(cita: Cita): void {
    const citasActuales = this.citasSource.value;
    this.citasSource.next([...citasActuales, cita]);
  }

  actualizarCita(citaActualizada: Cita): void {
    const citasActuales = this.citasSource.value;
    const index = citasActuales.findIndex(c => c.id === citaActualizada.id);
    
    if (index !== -1) {
      citasActuales[index] = citaActualizada;
      this.citasSource.next([...citasActuales]);
    }
  }

  eliminarCita(id: number): void {
    const citasActuales = this.citasSource.value.filter(c => c.id !== id);
    this.citasSource.next(citasActuales);
  }

  setFechaSeleccionada(fecha: string): void {
    this.fechaSeleccionadaSource.next(fecha);
  }

  limpiarSeleccion(): void {
    this.fechaSeleccionadaSource.next(null);
  }

  getCitaPorId(id: number): Cita | undefined {
    return this.citasSource.value.find(c => c.id === id);
  }
}