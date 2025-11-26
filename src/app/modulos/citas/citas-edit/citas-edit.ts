import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CitasService } from '../services/citaService';
import { ConexionApiAnimales } from '../services/conexionApiAnimales';
import { Cita, CitaRequest } from '../interfaces/citaI';
import { Animal } from '../interfaces/animalI';

@Component({
  selector: 'app-citas-edit',
  standalone: false,
  templateUrl: './citas-edit.html',
  styleUrl: './citas-edit.css',
})
export class CitasEdit implements OnInit, OnDestroy {
  cita: Cita = {
    id: "",
    titulo: '',
    fechaCita: '',
    lugar: '',
    motivo: '',
    fechaRealizacion: '',
    animalitoId: ''
  };

  citaRequest: CitaRequest = {
    titulo: '',
    fechaCita: '',
    lugar: '',
    motivo: '',
    fechaRealizacion: '',
    animalitoId: ''
  }

  terminoBusqueda = '';
  todosLosPacientes: Animal[] = [];
  animalesFiltrados: Animal[] = [];
  animalSeleccionado: Animal | null = null;
  mostrarLista = false;
  cargandoPacientes = false;

  esEdicion = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private citasService: CitasService, 
    private animalService: ConexionApiAnimales,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarTodosLosPacientes();
    
    const routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        const id = String(params['id']);
        const cita = this.citasService.getCitaPorId(id);
        if (cita) {
          this.cita = { ...cita };
          this.esEdicion = true;
          
          if (this.cita.animalitoId) {
            this.cargarPacientePorId(this.cita.animalitoId);
          }
        }
      }
    });

    const fechaSub = this.citasService.fechaSeleccionada$.subscribe(fecha => {
      if (fecha && !this.esEdicion) {
        this.cita.fechaCita = this.formatearFechaParaInput(fecha);
      }
    });

    this.subscriptions.push(routeSub, fechaSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  cargarTodosLosPacientes(): void {
    this.cargandoPacientes = true;
    this.animalService.obtenerAnimales().subscribe({
      next: (pacientes) => {
        this.todosLosPacientes = pacientes;
        this.cargandoPacientes = false;
      },
      error: (error) => {
        this.cargandoPacientes = false;
      }
    });
  }

  cargarPacientePorId(animalId: string): void {
    const animal = this.todosLosPacientes.find(p => p.id === animalId);
    if (animal) {
      this.animalSeleccionado = animal;
    }
  }

  filtrarPacientes(): void {
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.animalesFiltrados = this.todosLosPacientes.filter(animal =>
        animal.nombre.toLowerCase().includes(termino) ||
        animal.especie.toLowerCase().includes(termino) ||
        animal.raza.toLowerCase().includes(termino)
      );
    } else {
      this.animalesFiltrados = [];
    }
    this.mostrarLista = true;
  }

  seleccionarAnimal(animal: Animal): void {
    this.animalSeleccionado = animal;
    this.cita.animalitoId = animal.id;
    this.terminoBusqueda = animal.nombre;
    this.animalesFiltrados = [];
    this.mostrarLista = false;
  }

  deseleccionarPaciente(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.animalSeleccionado = null;
    this.cita.animalitoId = '';
    this.terminoBusqueda = '';
  }

  onClicFuera(): void {
    setTimeout(() => {
      this.mostrarLista = false;
    }, 200);
  }

  irAExpediente(animalId: string): void {
    this.router.navigate(['/expediente', animalId]);
  }

  usarImagenPorDefecto(event: any): void {
    event.target.src = '';
  }

  private formatearFechaParaInput(fecha: string): string {
    if (!fecha) return '';
    
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        return '';
      }
      const año = fechaObj.getFullYear();
      const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaObj.getDate()).padStart(2, '0');
      const horas = String(fechaObj.getHours()).padStart(2, '0');
      const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
      const segundos = String(fechaObj.getSeconds()).padStart(2, '0');
      
      return `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
    } catch (error) {
      return fecha;
    }
  }

  guardar(): void {
    if (!this.validarCita()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!this.animalSeleccionado) {
      alert('Por favor selecciona un paciente');
      return;
    }

    this.setFechaRealizacionActual();

    const citaParaEnviar: CitaRequest = {
      titulo: this.cita.titulo,
      fechaCita: this.formatearFechaCita(this.cita.fechaCita),
      lugar: this.cita.lugar,
      motivo: this.cita.motivo,
      fechaRealizacion: this.cita.fechaRealizacion,
      animalitoId: this.cita.animalitoId
    };

    if (this.esEdicion && this.cita.id) {
      this.citasService.actualizarCita(this.cita);
    } else {
      this.citasService.agregarCita(citaParaEnviar);
    }
    
    this.citasService.limpiarSeleccion();
    this.router.navigate(['/citas']);
  }

  cancelar(): void {
    this.citasService.limpiarSeleccion();
    this.router.navigate(['/citas']);
  }

  validarCita(): boolean {
    return !!(
      this.cita.titulo.trim() && 
      this.cita.fechaCita && 
      this.cita.lugar.trim() && 
      this.cita.motivo.trim() &&
      this.cita.animalitoId
    );
  }

  private setFechaRealizacionActual(): void {
    const ahora = new Date();
    this.cita.fechaRealizacion = ahora.toISOString();
  }

  private formatearFechaCita(fechaInput: string): string {
    if (!fechaInput) return '';
    
    try {
      const fecha = new Date(fechaInput);
      
      if (isNaN(fecha.getTime())) {
        return fechaInput;
      }
      
      const fechaISO = fecha.toISOString();
      return fechaISO;
    } catch (error) {
      return fechaInput;
    }
  }

  getFechaRealizacionFormateada(): string {
    if (!this.cita.fechaRealizacion) return '';
    
    const partes = this.cita.fechaRealizacion.split(' ');
    const fechaParte = partes[0];
    const horaParte = partes[1] || '';
    
    const fecha = new Date(fechaParte + 'T00:00:00Z');
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