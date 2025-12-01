import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CitasService } from '../services/citaService';
import { ConexionApiAnimales } from '../services/conexionApiAnimales';
import { Cita } from '../interfaces/citaI';
import { Animal } from '../interfaces/animalI';
import { ChangeDetectorRef } from '@angular/core';
import { FechaService } from '../services/fechasService';

@Component({
  selector: 'app-citas',
  standalone: false,
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})

export class Citas implements OnInit, OnDestroy {
  citaSeleccionada: Cita | null = null;
  animal: Animal | null = null;
  cargandoAnimal = false;
  private subscription?: Subscription;
  mostrarModalEliminar = false;

  constructor(
    private citasService: CitasService, 
    private animalService: ConexionApiAnimales,
    private router: Router,
    private route: ActivatedRoute,
     private cdr: ChangeDetectorRef,
     private fechaService: FechaService
  ) {}

ngOnInit(): void {
  this.subscription = this.route.params.subscribe(params => {
    
    if (params['id']) {
      const id = String(params['id']);
      const cita = this.citasService.getCitaPorId(id);
      
      if (cita) {
        this.citaSeleccionada = cita;
        this.cargarPaciente(cita.animalId);
      } else {
        this.router.navigate(['/citas']);
      }
    }
  });
}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

cargarPaciente(animalId: string): void {
  
  if (!animalId) {
    console.log('No hay animalId');
    return;
  }
  
  this.cargandoAnimal = true;

  this.animalService.getAnimalPorId(animalId).subscribe({
    next: (animal) => {
      
      this.animal = animal;
      this.cargandoAnimal = false;
      this.cdr.detectChanges();
      
      setTimeout(() => {
        console.log('🔄 Después de asignar - this.animal:', this.animal);
      }, 0);
    },
    error: (error) => {
      console.error('Error al cargar paciente:', error);
      this.cargandoAnimal = false;
    }
  });
}

  irAExpediente(animalId: string): void {
    if (this.animal) {
      this.router.navigate(['/expediente/editar', animalId]);
    }
  }

  usarImagenPorDefecto(event: any): void {
    event.target.src = '';
  }

  formatearFecha(fechaBD: string): string {
    return this.fechaService.formatearFechaLegible(fechaBD);
  }

  volverAlCalendario(): void {
    this.router.navigate(['/citas']);
  }

  editarCita(): void {
    if (this.citaSeleccionada?.id) {
      this.router.navigate(['citas/citas-edit', this.citaSeleccionada.id]);
    }
  }

  getFechaRealizacionFormateada(fechaRealizacion: string): string {
    return this.fechaService.formatearFechaRealizacion(fechaRealizacion);
  }

  eliminarCita(): void {
  this.mostrarModalEliminar = true;  
  }

  confirmarEliminar() {
    if (!this.citaSeleccionada?.id) return;

    this.citasService.eliminarCita(this.citaSeleccionada.id);
    this.mostrarModalEliminar = false;
    this.router.navigate(['/citas']);
  }

  cancelarEliminar() {
    this.mostrarModalEliminar = false;
  }
}