import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CitasService } from '../services/citaService';
import { ConexionApiAnimales } from '../services/conexionApiAnimales';
import { Cita } from '../interfaces/citaI';
import { Animal } from '../interfaces/animalI';

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

  constructor(
    private citasService: CitasService, 
    private animalService: ConexionApiAnimales,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      if (params['id']) {
        const id = String(params['id']);
        const cita = this.citasService.getCitaPorId(id);
        if (cita) {
          this.citaSeleccionada = cita;
        
          this.cargarPaciente(cita.animalitoId);
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
    if (!animalId) return;
    
    this.cargandoAnimal = true;
 
    this.animalService.getAnimalPorId(animalId).subscribe({
      next: (animal) => {
        this.animal = animal;
        this.cargandoAnimal = false;
      },
      error: (error) => {
        console.error('Error al cargar paciente:', error);
        this.cargandoAnimal = false;
      }
    });
  }

  irAExpediente(): void {
    if (this.animal) {
      this.router.navigate(['/expediente', this.animal.id]);
    }
  }

  usarImagenPorDefecto(event: any): void {
    event.target.src = '';
  }

  calcularEdad(fechaNacimiento: string): string {
    if (!fechaNacimiento) return 'Desconocida';
    
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    const diffTime = Math.abs(hoy.getTime() - nacimiento.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} días`;
    } else if (diffDays < 365) {
      const meses = Math.floor(diffDays / 30);
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else {
      const años = Math.floor(diffDays / 365);
      return `${años} ${años === 1 ? 'año' : 'años'}`;
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return fecha;
    }
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
    if (this.citaSeleccionada?.id && confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      this.citasService.eliminarCita(this.citaSeleccionada.id);
      this.router.navigate(['/citas']);
    }
  }
}