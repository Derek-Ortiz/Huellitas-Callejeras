import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CitasService } from '../services/citaService';
import { Cita } from '../interfaces/citaI';

@Component({
  selector: 'app-citas-edit',
  standalone: false,
  templateUrl: './citas-edit.html',
  styleUrl: './citas-edit.css',
})
export class CitasEdit implements OnInit, OnDestroy {
  cita: Cita = {
    titulo: '',
    fecha: '',
    lugar: '',
    motivo: '',
    fechaRealizacion: ''
  };

  esEdicion = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private citasService: CitasService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    const routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        const id = Number(params['id']);
        const cita = this.citasService.getCitaPorId(id);
        if (cita) {
          this.cita = { ...cita };
          this.esEdicion = true;
        }
      }
    });

   
    const fechaSub = this.citasService.fechaSeleccionada$.subscribe(fecha => {
      if (fecha && !this.esEdicion) {
        this.cita.fecha = fecha;
      }
    });

    this.subscriptions.push(routeSub, fechaSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  guardar(): void {
    if (!this.validarCita()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    this.setFechaRealizacionActual();

    let citaId: number;

    if (this.esEdicion && this.cita.id) {
      
      this.citasService.actualizarCita(this.cita);
      citaId = this.cita.id;
    } else {
     
      citaId = Date.now();
      const nuevaCita = { ...this.cita, id: citaId };
      this.citasService.agregarCita(nuevaCita);
    }
    
   
    this.citasService.limpiarSeleccion();
    
   
    this.router.navigate(['citas/citas', citaId]);
  }

  cancelar(): void {
    this.citasService.limpiarSeleccion();
    this.router.navigate(['/citas']);
  }

  private validarCita(): boolean {
    return !!(
      this.cita.titulo.trim() && 
      this.cita.fecha && 
      this.cita.lugar.trim() && 
      this.cita.motivo.trim()
    );
  }

    private setFechaRealizacionActual(): void {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    
    
    this.cita.fechaRealizacion = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  }

  getFechaRealizacionFormateada(): string {
    if (!this.cita.fechaRealizacion) return '';
    
    const partes = this.cita.fechaRealizacion.split(' ');
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
}

