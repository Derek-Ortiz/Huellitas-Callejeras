import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Expediente } from '../interfaces/expediente.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpedientesService {
  
    private expedientes: Expediente[] = [];

    constructor() {
        this.expedientes = this.generarDatosEjemplo();
    }

    obtenerExpedientes(): Observable<Expediente[]> {
        return of(this.expedientes);
    }

    agregarExpediente(expediente: Expediente): Observable<Expediente> {
        this.expedientes.push(expediente);
        return of(expediente);
    }

    obtenerExpedientePorId(id: number): Observable<Expediente | undefined> {
        const expediente = this.expedientes.find(e => e.id === id);
        return of(expediente);
    }

    actualizarExpediente(id: number, expediente: Expediente): Observable<Expediente> {
        const index = this.expedientes.findIndex(e => e.id === id);
        if (index !== -1) {
        this.expedientes[index] = expediente;
        }
        return of(expediente);
    }

    eliminarExpediente(id: number): Observable<boolean> {
        const index = this.expedientes.findIndex(e => e.id === id);
        if (index !== -1) {
        this.expedientes.splice(index, 1);
        return of(true);
        }
        return of(false);
    }

    // Para probar
    private generarDatosEjemplo(): Expediente[] {
        return [
        { id: 1, nombre: 'Max', raza: 'Chihuahua', imagenUrl: 'assets/images/dogs/dog1.jpg' },
        { id: 2, nombre: 'Luna', raza: 'Chihuahua', imagenUrl: 'assets/images/dogs/dog2.jpg' },
        { id: 3, nombre: 'Rocky', raza: 'Chihuahua', imagenUrl: 'assets/images/dogs/dog3.jpg' },
        { id: 4, nombre: 'Bella', raza: 'Chihuahua', imagenUrl: 'assets/images/dogs/dog4.jpg' },
        { id: 5, nombre: 'Toby', raza: 'Chihuahua', imagenUrl: 'assets/images/dogs/dog5.jpg' },
        { id: 6, nombre: 'Coco', raza: 'Chihuahua', imagenUrl: 'assets/images/dogs/dog6.jpg' },
        { id: 7, nombre: 'Simba', raza: 'Chihuahua', imagenUrl: 'assets/images/dogs/dog7.jpg' },
        { id: 8, nombre: 'Lola', raza: 'Chihuahua', imagenUrl: 'assets/images/dogs/dog8.jpg' }
        ];
    }
}