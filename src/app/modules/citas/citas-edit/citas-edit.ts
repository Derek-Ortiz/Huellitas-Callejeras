import { Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CitasService } from '../services/citaService';
import { ConexionApiAnimales } from '../services/conexionApiAnimales';
import { Cita, CitaRequest } from '../interfaces/citaI';
import { Animal } from '../interfaces/animalI';
import { FechaService } from '../services/fechasService';

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
    animalId: ''
  };

  citaRequest: CitaRequest = {
    titulo: '',
    fechaCita: '',
    lugar: '',
    motivo: '',
    fechaRealizacion: '',
    animalId: ''
  }

  terminoBusqueda = '';
  todosLosPacientes: Animal[] = [];
  animalesFiltrados: Animal[] = [];
  animalSeleccionado: Animal | null = null;
  mostrarLista = false;
  cargandoPacientes = false;
  cargandoAnimalInicial = false; 

  esEdicion = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private citasService: CitasService, 
    private animalService: ConexionApiAnimales,
    private router: Router,
    private route: ActivatedRoute,
    private fechaService: FechaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        const id = String(params['id']);
        const cita = this.citasService.getCitaPorId(id);
        if (cita) {
          this.cita = { ...cita };
          this.esEdicion = true;
      
          this.cita.fechaCita = this.fechaService.fechaBDaInputLocal(cita.fechaCita);
          
          this.cargarTodosLosPacientes(cita.animalId);
        }
      }
    });

    const fechaSub = this.citasService.fechaSeleccionada$.subscribe(fecha => {
      if (fecha && !this.esEdicion) {
        this.cita.fechaCita = this.fechaService.fechaBDaInputLocal(fecha);
        this.cargarTodosLosPacientes();
      }
    });

    this.subscriptions.push(routeSub, fechaSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  cargarTodosLosPacientes(animalId?: string): void {
    this.cargandoPacientes = true;
    this.animalService.obtenerAnimales().subscribe({
      next: (pacientes) => {
        this.todosLosPacientes = pacientes;
        this.cargandoPacientes = false;
        console.log('animales cargados:', pacientes.length);
        
        if (animalId && this.esEdicion) {
          this.cargarAnimalSeleccionado(animalId);
        }
      },
      error: (error) => {
        console.error('Error cargando animales:', error);
        this.cargandoPacientes = false;
      }
    });
  }

  cargarAnimalSeleccionado(animalId: string): void {
    const animal = this.todosLosPacientes.find(p => p.id === animalId);
    
    if (animal) {
      this.animalSeleccionado = animal;
      this.terminoBusqueda = animal.nombre;
      this.cdr.detectChanges();
    } else {
      this.cargandoAnimalInicial = true;
      this.cdr.detectChanges();
      
      this.animalService.getAnimalPorId(animalId).subscribe({
        next: (animalIndividual) => {
          this.animalSeleccionado = animalIndividual;
          this.terminoBusqueda = animalIndividual.nombre;
          this.cargandoAnimalInicial = false;
          
          this.todosLosPacientes.push(animalIndividual);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('❌ Error cargando animal individual:', error);
          this.cargandoAnimalInicial = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  estaCargandoAnimalInicial(): boolean {
    return this.cargandoAnimalInicial;
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
    this.cita.animalId = animal.id;
    this.terminoBusqueda = animal.nombre;
    this.animalesFiltrados = [];
    this.mostrarLista = false;
  }

  deseleccionarPaciente(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.animalSeleccionado = null;
    this.cita.animalId = '';
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
      fechaCita: this.fechaService.inputLocalAFechaBD(this.cita.fechaCita),
      lugar: this.cita.lugar,
      motivo: this.cita.motivo,
      fechaRealizacion: this.cita.fechaRealizacion,
      animalId: this.cita.animalId
    };


    if (this.esEdicion && this.cita.id) {
      this.cita.fechaCita = this.fechaService.inputLocalAFechaBD(this.cita.fechaCita);
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
      this.cita.animalId
    );
  }

  private setFechaRealizacionActual(): void {
    const ahora = new Date();
    this.cita.fechaRealizacion = ahora.toISOString();
  }

}