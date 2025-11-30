import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cita, CitaRequest } from '../interfaces/citaI';
import { ConexionApiCitas } from './conexion-api-citas';

@Injectable({ providedIn: 'root' })
export class CitasService {
    private citasSource = new BehaviorSubject<Cita[]>([]);
  citas$ = this.citasSource.asObservable();

  private fechaSeleccionadaSource = new BehaviorSubject<string | null>(null);
  fechaSeleccionada$ = this.fechaSeleccionadaSource.asObservable();

  private loadingSource = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSource.asObservable();

  private errorSource = new BehaviorSubject<string | null>(null);
  error$ = this.errorSource.asObservable();

  constructor(private conexionApiCitas: ConexionApiCitas) {
    
  }

  cargarCitas(): void {
   
    this.loadingSource.next(true);
    this.errorSource.next(null);

    this.conexionApiCitas.obtenerCitas().subscribe({
      next: (citas) => {
       
        this.citasSource.next(citas);
        this.loadingSource.next(false);
      },
      error: (err) => {
        this.errorSource.next('Error al cargar las citas: ' + err.message);
        this.loadingSource.next(false);
      }
    });
  }
  
  agregarCita(citaRequest: CitaRequest): void {
    this.loadingSource.next(true);
    this.errorSource.next(null);
    console.log('Agregando cita:', citaRequest);
    this.conexionApiCitas.crearCita(citaRequest).subscribe({
      next: (nuevaCita) => {
        const citasActuales = this.citasSource.value;
        this.citasSource.next([...citasActuales, nuevaCita]);
        this.loadingSource.next(false);
      },
      error: (err) => {
        this.errorSource.next('Error al agregar la cita: ' + err.message);
        this.loadingSource.next(false);
      }
    });
  }
  actualizarCita(cita: Cita): void {
    if(!cita.id) {
      return;
    }
    this.loadingSource.next(true);
    this.errorSource.next(null);

    this.conexionApiCitas.actualizarCita(cita.id!, cita).subscribe({
      next: citaActualizada => {
        const actual = this.citasSource.value;
        const index = actual.findIndex(c => c.id === citaActualizada.id);
    
    if (index !== -1) {
      actual[index] = citaActualizada;
      this.citasSource.next([...actual]);
    }
    this.loadingSource.next(false);

  },
  error: (err) => {

    this.errorSource.next('Error al actualizar la cita');
    this.loadingSource.next(false);
  }
  });
}

  eliminarCita(id: string): void {

    this.loadingSource.next(true);
    this.errorSource.next(null);

    this.conexionApiCitas.eliminarCita(id).subscribe({
      next: () => {
        const actual = this.citasSource.value.filter(c => c.id !== id);
        this.citasSource.next(actual);
        this.loadingSource.next(false);
    
    },
      error: (err) => {
       
        this.errorSource.next('Error al eliminar la cita');
        this.loadingSource.next(false);
      }
    });
  }

  setFechaSeleccionada(fecha: string): void {
    this.fechaSeleccionadaSource.next(fecha);
  }

  limpiarSeleccion(): void {
    this.fechaSeleccionadaSource.next(null);
  }

  getCitaPorId(id: string): Cita | undefined {
    return this.citasSource.value.find(c => c.id === id);
  }

  limpiarError(): void {
    this.errorSource.next(null);
  }
}