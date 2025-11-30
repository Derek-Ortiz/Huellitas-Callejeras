import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ExpedientesService } from '../../services/expedientes.service';
import { Expediente } from '../../interfaces/expediente.interface';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-galeria',
    standalone: false,
    templateUrl: './galeria.component.html',
    styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit, OnDestroy {
    expedientes: Expediente[] = [];
    expedientesFiltrados: Expediente[] = [];
    cargando: boolean = true;
    textoBusqueda: string = '';
    
    mostrarModal: boolean = false;
    expedienteAEliminar: Expediente | null = null;
    errorMessage: string = '';
    
    mostrarMensajeExito: boolean = false;
    mensajeExito: string = '';

    private pollingSubscription?: Subscription;
    private readonly POLLING_INTERVAL = 5000; 
    constructor(
        private expedientesService: ExpedientesService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.cargarExpedientes();
        this.iniciarPolling();
    }

    ngOnDestroy(): void {
        if (this.pollingSubscription) {
        this.pollingSubscription.unsubscribe();
        }
    }

    iniciarPolling(): void {
        this.pollingSubscription = interval(this.POLLING_INTERVAL)
        .pipe(
            switchMap(() => this.expedientesService.obtenerExpedientes())
        )
        .subscribe({
            next: (expedientes) => {
            this.expedientes = expedientes;
            this.aplicarFiltro();
            this.cdr.detectChanges();
            },
            error: (error) => {
            console.error('Error en polling:', error);
            }
        });
    }

    cargarExpedientes(): void {
        this.cargando = true;
        this.errorMessage = '';
        
        this.expedientesService.obtenerExpedientes().subscribe({
        next: (expedientes) => {
            this.expedientes = expedientes;
            this.expedientesFiltrados = expedientes;
            this.cargando = false;
            this.cdr.detectChanges();
            console.log('Expedientes cargados:', expedientes.length);
        },
        error: (error) => {
            console.error('Error al cargar expedientes:', error);
            this.errorMessage = error.message || 'Error al cargar expedientes';
            this.cargando = false;
            this.cdr.detectChanges(); 
        }
        });
    }

    aplicarFiltro(): void {
        const busqueda = this.textoBusqueda.toLowerCase().trim();
        
        if (busqueda === '') {
        this.expedientesFiltrados = [...this.expedientes];
        } else {
        this.expedientesFiltrados = this.expedientes.filter(expediente => 
            expediente.nombre.toLowerCase().includes(busqueda) ||
            expediente.id.toString().includes(busqueda) ||
            expediente.raza?.toLowerCase().includes(busqueda) ||
            expediente.especie.toLowerCase().includes(busqueda)
        );
        }
        this.cdr.detectChanges();
    }

    onBuscar(): void {
        this.aplicarFiltro();
    }

    onClickVolver(): void {
        this.router.navigate(['/']);
    }

    onClickAgregar(): void {
        console.log('Agregar expediente');
        //ruta
    }

    onClickTarjeta(expediente: Expediente): void {
        console.log('Expediente seleccionado:', expediente);
        //ruta
    }

    abrirModalEliminar(expediente: Expediente): void {
        this.expedienteAEliminar = expediente;
        this.mostrarModal = true;
        this.cdr.detectChanges();
    }

    cerrarModal(): void {
        this.mostrarModal = false;
        this.expedienteAEliminar = null;
        this.cdr.detectChanges();
    }

    confirmarEliminar(): void {
        if (!this.expedienteAEliminar) {
        return;
        }

        const id = this.expedienteAEliminar.id;
        const nombre = this.expedienteAEliminar.nombre;
        
        console.log('Iniciando eliminación de:', nombre);
        
        this.cerrarModal();
        

        this.expedientesService.eliminarExpediente(id).subscribe({
        next: (eliminado) => {
            console.log('Respuesta de eliminación:', eliminado);
            
            if (eliminado) {
            this.expedientes = this.expedientes.filter(e => e.id !== id);
            this.expedientesFiltrados = this.expedientesFiltrados.filter(e => e.id !== id);
            
            this.mostrarMensajeExito = true;
            this.mensajeExito = `✓ El animal "${nombre}" ha sido eliminado`;
            
            this.cdr.detectChanges();
            
            console.log('Vista actualizada. Total expedientes:', this.expedientes.length);
            
            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                this.mostrarMensajeExito = false;
                this.cdr.detectChanges();
            }, 3000);
            
            } else {
            this.mostrarError('No se pudo eliminar el expediente');
            }
        },
        error: (error) => {
            console.error('Error al eliminar:', error);
            this.mostrarError(`Error: ${error.message}`);
        }
        });
    }

    mostrarError(mensaje: string): void {
        this.errorMessage = mensaje;
        this.cdr.detectChanges();
        
        setTimeout(() => {
        this.errorMessage = '';
        this.cdr.detectChanges();
        }, 5000);
    }

    trackByExpedienteId(index: number, expediente: Expediente): string {
        return expediente.id;
    }
}