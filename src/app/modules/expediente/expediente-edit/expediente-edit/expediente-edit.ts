import { Component, OnInit, ViewChild, OnDestroy, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConexionApiAnimales } from '../../services/conexion-api-animales';
import { Animal, AnimalRequest, RescateRequest, AnimalRescateRequest, RescateResponse } from '../../interfaces/paciente.interface';
import { ExpedienteForm } from '../../expediente-form/expediente-form/expediente-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expediente-edit',
  standalone: false,
  templateUrl: './expediente-edit.html',
  styleUrls: ['./expediente-edit.css']
})
export class ExpedienteEdit implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('expForm') expForm?: ExpedienteForm;
  @ViewChild('avatarInput') avatarInput?: ElementRef<HTMLInputElement>;
  isEditing = false;
  animalEstado: 'En adopción' | 'Adoptado' | 'En recuperación' = 'En adopción';
  initialAnimal: Animal | null = null;
  initialRescate: RescateResponse | null = null;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  showCancelModal = false;
  cancelMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ConexionApiAnimales,
    private cdr: ChangeDetectorRef
  ) {}
  private routeSub?: Subscription;

  ngOnInit(): void {
    console.log(' ExpedienteEdit - ngOnInit iniciado');
    this.routeSub = this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      console.log(' Parámetro ID de ruta:', id);
      if (id) {
        this.loadById(id);
      } else {
        console.log(' No hay ID - modo creación');
        this.initialAnimal = null;
        this.initialRescate = null;
      }
    });
  }

  ngAfterViewInit(): void {
    console.log(' ExpedienteEdit - ngAfterViewInit');
    console.log(' expForm disponible:', !!this.expForm);
    console.log(' initialAnimal disponible:', !!this.initialAnimal);
    
    if (this.expForm && this.initialAnimal) {
      try { 
        console.log(' Intentando cargar datos en formulario...');
        const formData = this.mapAnimalToFormData(this.initialAnimal, this.initialRescate);
        console.log(' Datos mapeados para formulario:', formData);
        this.expForm.model = formData; 
        console.log(' Formulario cargado exitosamente');
      } catch (e) {
        console.error(' Error cargando formulario:', e);
      }
    }
  }

  private loadById(idParam: string) {
    console.log(' loadById llamado con ID:', idParam);
    
    this.api.getConRescate(idParam).subscribe(
      (res) => {
        console.log(' Respuesta de API recibida:', res);
        
        if (!res) {
          console.warn(' Respuesta vacía de API');
          return;
        }

        let animal: Animal;
        let rescate: RescateResponse;

        if ((res as any).animal && (res as any).rescate) {
          console.log('Estructura: animal y rescate separados');
          animal = (res as any).animal as Animal;
          rescate = (res as any).rescate as RescateResponse;
        } else {
          console.log('Estructura: datos combinados');
          animal = res as Animal;
          rescate = {
            id: (res as any).rescateId || '',
            fechaIngreso: (res as any).fechaIngreso || '',
            lugar: (res as any).lugar || '',
            descripcion: (res as any).descripcion || '',
            animalId: idParam
          };
        }

        console.log('Animal cargado:', animal);
        console.log('Rescate cargado:', rescate);

        this.initialAnimal = animal;
        this.initialRescate = rescate;
        this.animalEstado = animal.estado;
        console.log('Estado del animal:', this.animalEstado);

        this.isEditing = false;

        if (animal.urlImage && animal.urlImage.trim() !== '') {
          console.log('URL de imagen encontrada:', animal.urlImage);
          this.imagePreviews = [animal.urlImage];
        } else {
          console.log('No hay URL de imagen');
        }

        setTimeout(() => {
          console.log('Timeout ejecutado - expForm disponible:', !!this.expForm);
          if (this.expForm) {
            const formData = this.mapAnimalToFormData(animal, rescate);
            console.log('Cargando datos en formulario después de timeout:', formData);
            this.expForm.model = { ...formData };
            this.cdr.detectChanges();
            console.log('Change detection ejecutado');
          }
        });

        this.cdr.detectChanges();
      },
      (err) => {
        console.error('Error cargando animal por id:', err);
      }
    );
  }

  private mapAnimalToFormData(animal: Animal, rescate?: RescateResponse | null): any {
    console.log('🔍 mapAnimalToFormData llamado con:', { animal, rescate });
    
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };

    const formData = {
      id: animal.id,
      nombre: animal.nombre || '',
      especie: animal.especie || '',
      raza: animal.raza || '',
      edad: animal.edad?.toString() || '',
      sexo: animal.sexo || '',
      peso: animal.peso?.toString() || '',
      fechaIngreso: rescate ? formatDate(rescate.fechaIngreso) : '',
      lugar: rescate?.lugar || '',
      descripcion: rescate?.descripcion || '',
      fechaSalida: animal.fechaSalida ? formatDate(animal.fechaSalida) : '',
      estado: animal.estado,
      urlImage: animal.urlImage || '',
      rescatistaId: animal.rescatistaId || ''
    };

    console.log(' Datos formateados para formulario:', formData);
    return formData;
  }

  ngOnDestroy(): void {
    console.log(' ExpedienteEdit - ngOnDestroy');
    this.clearImagePreviews();
    if (this.routeSub) {
      try { this.routeSub.unsubscribe(); } catch (e) {}
    }
  }

  toggleEdit() {
    console.log('toggleEdit llamado - isEditing actual:', this.isEditing);
    
    if (this.isEditing && this.expForm) {
      try {
        if (this.expForm.hasMissingRequired && this.expForm.hasMissingRequired()) {
          console.log('Formulario tiene campos requeridos faltantes');
          return;
        }
      } catch (e) {
        console.error('Error verificando campos requeridos:', e);
      }
    }

    this.isEditing = !this.isEditing;
    console.log('isEditing cambiado a:', this.isEditing);
  }

  onEstadoChange(nuevo: 'En adopción' | 'Adoptado' | 'En recuperación') {
    console.log(' onEstadoChange - Nuevo estado:', nuevo);
    this.animalEstado = nuevo;
  }

  onTratamientos() {
    console.log(' onTratamientos llamado');
    if (this.expForm) {
      if ((this.expForm as any).disabled) {
        console.log('Formulario deshabilitado, no se puede proceder');
        return;
      }
      console.log('Ejecutando onSubmit del formulario');
      this.expForm.onSubmit();
    } else {
      console.warn('expForm no disponible en onTratamientos');
    }
  }

  onFormCancel() {
    console.log('onFormCancel llamado');
    this.cancelMessage = '¿Deseas deshacer estos cambios?';
    this.showCancelModal = true;
    console.log('Modal de cancelación activado');
  }

  onModalConfirm() {
    console.log('onModalConfirm - Confirmando cancelación');
    this.showCancelModal = false;
    this.isEditing = false;
    if (this.expForm && this.initialAnimal) {
      try {
        const formData = this.mapAnimalToFormData(this.initialAnimal, this.initialRescate);
        console.log(' Restaurando datos originales:', formData);
        this.expForm.model = { ...formData };
        this.expForm.missingFields = new Set();
        console.log(' Datos restaurados exitosamente');
      } catch (e) {
        console.error('Error restaurando datos:', e);
      }
    }
    this.clearImagePreviews();
  }

  onModalCancel() {
    console.log('onModalCancel - Cancelando acción');
    this.showCancelModal = false;
  }

  goToView() {
    console.log(' goToView llamado - Navegando a vista');
    if (this.expForm) {
      try {
        this.expForm.model = {};
        this.expForm.missingFields = new Set();
      } catch (e) {}
    }

    this.clearImagePreviews();

    try {
      this.router.navigateByUrl('/expediente/view');
      console.log(' Navegación a /expediente/view iniciada');
    } catch (e) {
      console.error(' Error en navegación:', e);
    }
  }

  onFilesSelected(event: Event) {
    console.log(' onFilesSelected llamado');
    const input = event.target as HTMLInputElement;
    console.log('Archivos seleccionados:', input.files);
    
    if (!input.files || input.files.length === 0) {
      console.log('No hay archivos seleccionados');
      return;
    }

    this.clearImagePreviews();

    const files = Array.from(input.files);
    this.selectedFiles = files;
    console.log('Archivos procesados:', files.length);

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        console.log('Archivo no es imagen:', file.name);
        continue;
      }
      const url = URL.createObjectURL(file);
      this.imagePreviews.push(url);
      console.log('Preview creado para:', file.name);
    }
    
    console.log('Total de previews:', this.imagePreviews.length);
  }

  onAvatarClick(event: Event) {
    console.log('onAvatarClick llamado - isEditing:', this.isEditing);
    
    if (!this.isEditing) {
      console.log('No está en modo edición, previniendo acción');
      event.preventDefault();
      return;
    }
    
    try {
      const input = this.avatarInput ? this.avatarInput.nativeElement : null;
      console.log('Input de archivo disponible:', !!input);
      
      if (!input) return;
      
      try { 
        input.value = ''; 
        console.log('Input de archivo limpiado');
      } catch (e) {}
      
      input.click();
      console.log('Input de archivo activado');
    } catch (err) {
      console.error('Error opening file input', err);
    }
  }

  private clearImagePreviews() {
    console.log('clearImagePreviews llamado');
    console.log('Previews a limpiar:', this.imagePreviews.length);
    
    for (const url of this.imagePreviews) {
      try { URL.revokeObjectURL(url); } catch (e) { }
    }
    this.imagePreviews = [];
    this.selectedFiles = [];
    console.log(' Previews limpiados');
  }

  onSave(data: any) {
    console.log('onSave llamado con datos:', data);
    console.log('Archivos seleccionados:', this.selectedFiles.length);
    
    const idExists = this.initialAnimal && this.initialAnimal.id;
    console.log(' Modo:', idExists ? 'EDICIÓN' : 'CREACIÓN');
    console.log('ID existente:', idExists ? this.initialAnimal!.id : 'Ninguno');


      const formatToISO = (dateString: string): string | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch {
      return null;
    }
  };

    const animalRequest: AnimalRequest = {
      nombre: data.nombre ?? '',
      peso: Number(data.peso) || 0,
      especie: data.especie ?? 'Perro',
      estado: this.animalEstado, 
      raza: data.raza ?? '',
      edad: Number(data.edad) || 0,
      sexo: data.sexo ?? 'Macho',
      rescatistaId: data.rescatistaId || this.getRescatistaIdFromStorage(),
      ...(data.fechaSalida && { fechaSalida: formatToISO(data.fechaSalida) })
    };

    const rescateRequest: RescateRequest = {
      lugar: data.lugar ?? '',
      descripcion: data.descripcion ?? ''
    };

    const payload: AnimalRescateRequest = {
      animal: animalRequest,
      rescate: rescateRequest
    };

    console.log(' Payload para API:', payload);

    const file = this.selectedFiles && this.selectedFiles.length > 0 ? this.selectedFiles[0] : undefined;
    console.log(' Archivo a enviar:', file ? file.name : 'Ninguno');

    if (idExists) {
      const idStr = this.initialAnimal!.id;
      console.log(' Actualizando animal con ID:', idStr);
      
      this.api.actualizarConRescateFormData(idStr, payload, file).subscribe(
        (res) => {
          console.log('Animal actualizado exitosamente:', res);
          if (res && (res as any).animal) {
            this.initialAnimal = (res as any).animal as Animal;
            if (this.initialAnimal.urlImage) {
              this.imagePreviews = [this.initialAnimal.urlImage];
            }
          }
          this.isEditing = false;
          this.clearImagePreviews();
          console.log('🔍 Edición completada - modo edición desactivado');
        }, 
        (err) => {
          console.error('Error actualizando animal con rescate:', err);
        }
      );
    } else {
      console.log('Creando nuevo animal');
      this.api.crearConRescateFormData(payload, file).subscribe(
        (res) => {
          console.log('Animal creado exitosamente:', res);
          if (res && (res as any).animal) {
            this.initialAnimal = (res as any).animal as Animal;
            if (this.initialAnimal.urlImage) {
              this.imagePreviews = [this.initialAnimal.urlImage];
            }
          }
          this.isEditing = false;
          this.clearImagePreviews();
          console.log(' Creación completada');
          
          if (this.initialAnimal && this.initialAnimal.id) {
            console.log(' Navegando a edición con nuevo ID:', this.initialAnimal.id);
            this.router.navigate(['/galeria']);
          }
        }, 
        (err) => {
          console.error(' Error creando animal con rescate:', err);
        }
      );
    }
  }

  private getRescatistaIdFromStorage(): string {
    console.log('getRescatistaIdFromStorage llamado');
    
    try {
      const token = localStorage.getItem('auth_token');
      console.log('Token encontrado:', !!token);
      
      if (token && token.split('.').length === 3) {
        const pl = JSON.parse(atob(token.split('.')[1]));
        console.log(' Payload del token:', pl);
        const rescatistaId = pl.sub ?? pl.id ?? pl.userId ?? pl.rescatistaId ?? '';
        console.log('Rescatista ID del token:', rescatistaId);
        return rescatistaId;
      }
    } catch (e) {
      console.error('Error procesando token:', e);
    }
    
    const stored = localStorage.getItem('rescatista_id');
    console.log('Rescatista ID de localStorage:', stored);
    
    return stored || 'no-encontrado';
  }
}