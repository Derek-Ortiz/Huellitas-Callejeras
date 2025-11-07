import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CitasService } from '../services/citaService';
import { Cita } from '../interfaces/citaI';

@Component({
  selector: 'app-citas',
  standalone: false,
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class Citas implements OnInit, OnDestroy {
  citaSeleccionada: Cita | null = null;
  private subscription?: Subscription;

  constructor(
    private citasService: CitasService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      if (params['id']) {
        const id = Number(params['id']);
        const cita = this.citasService.getCitaPorId(id);
        if (cita) {
          this.citaSeleccionada = cita;
        } else {
          this.router.navigate(['/citas']);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
    if (!fechaRealizacion) return '';
  
    const partes = fechaRealizacion.split(' ');
    const fechaParte = partes[0];
    const horaParte = partes[1] || '';
    
    const fecha = new Date(fechaParte + 'T00:00:00');
    const opciones: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    
    if (horaParte) {
      return `${fechaFormateada} a las ${horaParte}`;
    }
    
    return fechaFormateada;
  }

  eliminarCita(): void {
    if (this.citaSeleccionada?.id) {
      this.citasService.eliminarCita(this.citaSeleccionada.id);
      this.router.navigate(['/citas']);
    }
  }
}