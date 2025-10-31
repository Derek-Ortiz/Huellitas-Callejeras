import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private citasSource = new BehaviorSubject<any[]>([]);
  citas$ = this.citasSource.asObservable();

  private fechaSeleccionadaSource = new BehaviorSubject<string | null>(null);
  fechaSeleccionada$ = this.fechaSeleccionadaSource.asObservable();

    private citaSeleccionadaSource = new BehaviorSubject<any | null>(null);
  citaSeleccionada$ = this.citaSeleccionadaSource.asObservable();

  agregarCita(cita: any) {
    const nuevaCita = { ...cita, id: Date.now() }; 
    const citasActuales = this.citasSource.value;
    this.citasSource.next([...citasActuales, nuevaCita]);
  }


  setFechaSeleccionada(fecha: string) {
    this.fechaSeleccionadaSource.next(fecha);
  }

  setCitaSeleccionada(id: number) {
    const cita = this.citasSource.value.find(c => c.id === id);
    this.citaSeleccionadaSource.next(cita || null);
  }
}
