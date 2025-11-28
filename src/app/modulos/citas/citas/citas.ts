import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CitasService } from '../services/citaService';
import { ConexionApiAnimales } from '../services/conexionApiAnimales';
import { Cita } from '../interfaces/citaI';
import { Animal } from '../interfaces/animalI';
import { ConexionApiCitas } from '../services/conexion-api-citas';
import { AuthService } from '../services/auth';

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
    private router: Router,
    private route: ActivatedRoute,
     private authService: AuthService,
    private conexionAnimales: ConexionApiAnimales,
    private conexionCitas: ConexionApiCitas
  ) {}

  ngOnInit(): void {
    console.log('🚀 Componente de citas inicializado');
    this.verificarEstadoAutenticacion();
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
 
    this.conexionAnimales.getAnimalPorId(animalId).subscribe({
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


   // Método para verificar el estado actual de la autenticación
  verificarEstadoAutenticacion() {
    console.log('🔍 === ESTADO ACTUAL DE AUTENTICACIÓN ===');
    const token = localStorage.getItem('token');
    console.log('📋 Token en localStorage:', token);
    console.log('🔐 isLogged():', this.authService.isLogged());
    console.log('========================================');
  }

  // 🧪 MÉTODO DE PRUEBA - EJECUTA ESTE PRIMERO
  testAuthCompleto() {
    console.clear();
    console.log('🧪 === INICIANDO PRUEBA COMPLETA DE AUTENTICACIÓN ===');
    
    // 1. Limpiar token existente
    console.log('1️⃣  LIMPIANDO TOKEN ANTERIOR...');
    localStorage.removeItem('token');
    console.log('✅ Token anterior eliminado');
    
    // 2. Verificar que no hay token
    this.verificarEstadoAutenticacion();
    
    // 3. Intentar obtener animales SIN token (debería fallar)
    console.log('2️⃣  PROBANDO PETICIÓN SIN TOKEN...');
    this.conexionAnimales.obtenerAnimales().subscribe({
      next: (animales) => {
        console.log('❌ INESPERADO: Animales obtenidos sin token?', animales);
      },
      error: (err) => {
        console.log('✅ ESPERADO: Error sin token:', err.status, err.message);
      }
    });

    // 4. Hacer login
    console.log('3️⃣  INICIANDO LOGIN...');
    this.authService.login().subscribe({
      next: (res) => {
        console.log('✅ Login exitoso en subscribe');
        console.log('📥 Respuesta completa en subscribe:', res);
        
        // 5. Verificar estado después del login
        setTimeout(() => {
          console.log('4️⃣  ESTADO DESPUÉS DEL LOGIN...');
          this.verificarEstadoAutenticacion();
          
          // 6. Probar obtener animales CON token
          console.log('5️⃣  PROBANDO PETICIÓN CON TOKEN...');
          this.conexionAnimales.obtenerAnimales().subscribe({
            next: (animales) => {
              console.log('🎉 ÉXITO: Animales obtenidos correctamente');
              console.log('📊 Cantidad de animales:', animales.length);
              console.log('🐶 Primer animal:', animales[0]);
            },
            error: (err) => {
              console.error('❌ ERROR obteniendo animales con token:', err);
              console.error('   Status:', err.status);
              console.error('   Message:', err.message);
              
              // Si falla, probar también con citas
              this.probarCitas();
            }
          });
        }, 500);
      },
      error: (err) => {
        console.error('💥 ERROR en login:', err);
        console.error('   Detalles:', err.message);
      },
      complete: () => {
        console.log('✅ Flujo de login completado');
      }
    });
  }

  // Método para probar las citas específicamente
  probarCitas() {
    console.log('6️⃣  PROBANDO OBTENER CITAS...');
    this.conexionCitas.obtenerCitas().subscribe({
      next: (citas) => {
        console.log('🎉 ÉXITO: Citas obtenidas correctamente');
        console.log('📊 Cantidad de citas:', citas.length);
        console.log('📅 Primera cita:', citas[0]);
      },
      error: (err) => {
        console.error('❌ ERROR obteniendo citas:', err);
        console.error('   Status:', err.status);
        console.error('   Message:', err.message);
      }
    });
  }

  // Método rápido solo para probar el login
  soloLogin() {
    console.clear();
    console.log('🔐 === SOLO LOGIN ===');
    
    this.authService.login().subscribe({
      next: (res) => {
        console.log('✅ Login exitoso');
        console.log('📥 Respuesta:', res);
        this.verificarEstadoAutenticacion();
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
      }
    });
  }

  // Método para probar solo la obtención de animales (después de login)
  probarSoloAnimales() {
    console.log('🐾 === PROBANDO OBTENER ANIMALES ===');
    this.verificarEstadoAutenticacion();
    
    this.conexionAnimales.obtenerAnimales().subscribe({
      next: (animales) => {
        console.log('✅ Animales obtenidos:', animales.length);
      },
      error: (err) => {
        console.error('❌ Error:', err);
      }
    });
  }

  // Método para limpiar todo
  limpiarTodo() {
    console.clear();
    localStorage.removeItem('token');
    console.log('🧹 Todo limpiado - Token eliminado');
    this.verificarEstadoAutenticacion();
  }

}


