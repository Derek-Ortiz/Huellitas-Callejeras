import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpedientesService } from '../../services/expedientes.service';
import { Expediente } from '../../interfaces/expediente.interface';
import { TarjetaExpedienteComponent } from '../tarjeta-expediente/tarjeta-expediente.component';

@Component({
    selector: 'app-galeria',
    standalone: true,
    imports: [CommonModule, FormsModule, TarjetaExpedienteComponent],
    templateUrl: './galeria.component.html',
    styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {
    expedientes: Expediente[] = [];
    expedientesFiltrados: Expediente[] = [];
    cargando: boolean = true;
    textoBusqueda: string = '';

    @Output() clickVolver = new EventEmitter<void>();
    @Output() clickAgregar = new EventEmitter<void>();
    @Output() clickExpediente = new EventEmitter<Expediente>();

    constructor(private expedientesService: ExpedientesService) { }

    ngOnInit(): void {
        this.cargarExpedientes();
    }

    cargarExpedientes(): void {
        this.cargando = true;
        this.expedientesService.obtenerExpedientes().subscribe({
        next: (expedientes) => {
            this.expedientes = expedientes;
            this.expedientesFiltrados = expedientes;
            this.cargando = false;
        },
        error: (error) => {
            console.error('Error al cargar expedientes:', error);
            this.cargando = false;
        }
        });
  }

    onBuscar(): void {
        const busqueda = this.textoBusqueda.toLowerCase().trim();
        
        if (busqueda === '') {
        this.expedientesFiltrados = this.expedientes;
        } else {
        this.expedientesFiltrados = this.expedientes.filter(expediente => 
            expediente.nombre.toLowerCase().includes(busqueda) ||
            expediente.id.toString().includes(busqueda) ||
            expediente.raza.toLowerCase().includes(busqueda)
        );
        }
    }

    onClickVolver(): void {
        this.clickVolver.emit();
    }

    onClickAgregar(): void {
        this.clickAgregar.emit();
    }

    onClickTarjeta(expediente: Expediente): void {
        this.clickExpediente.emit(expediente);
        console.log('Expediente seleccionado:', expediente);
    }

    trackByExpedienteId(index: number, expediente: Expediente): number {
        return expediente.id;
    }
}