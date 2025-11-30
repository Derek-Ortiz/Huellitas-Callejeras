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
    this.routeSub = this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (id) {
        this.loadById(id);
      } else {
        this.initialAnimal = null;
        this.initialRescate = null;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.expForm && this.initialAnimal) {
      try { 
        const formData = this.mapAnimalToFormData(this.initialAnimal, this.initialRescate);
        this.expForm.model = formData; 
      } catch (e) {}
    }
  }

  private loadById(idParam: string) {
    this.api.getConRescate(idParam).subscribe(
      (res) => {
        if (!res) return;

        let animal: Animal;
        let rescate: RescateResponse;

        if ((res as any).animal && (res as any).rescate) {
          animal = (res as any).animal as Animal;
          rescate = (res as any).rescate as RescateResponse;
        } else {
          animal = res as Animal;
          rescate = {
            id: (res as any).rescateId || '',
            fechaIngreso: (res as any).fechaIngreso || '',
            lugar: (res as any).lugar || '',
            descripcion: (res as any).descripcion || '',
            animalId: idParam
          };
        }

        this.initialAnimal = animal;
        this.initialRescate = rescate;
        this.animalEstado = animal.estado;

        this.isEditing = false;

        if (animal.urlImage && animal.urlImage.trim() !== '') {
          this.imagePreviews = [animal.urlImage];
        }

        setTimeout(() => {
          if (this.expForm) {
            const formData = this.mapAnimalToFormData(animal, rescate);
            this.expForm.model = { ...formData };
            this.cdr.detectChanges();
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

    return formData;
  }

  ngOnDestroy(): void {
    this.clearImagePreviews();
    if (this.routeSub) {
      try { this.routeSub.unsubscribe(); } catch (e) {}
    }
  }

  toggleEdit() {
    if (this.isEditing && this.expForm) {
      try {
        if (this.expForm.hasMissingRequired && this.expForm.hasMissingRequired()) {
          return;
        }
      } catch (e) {}
    }

    this.isEditing = !this.isEditing;
  }

  onEstadoChange(nuevo: 'En adopción' | 'Adoptado' | 'En recuperación') {
    this.animalEstado = nuevo;
  }

  onTratamientos() {
    if (this.expForm) {
      if ((this.expForm as any).disabled) {
        return;
      }
      this.expForm.onSubmit();
    }
  }

  onFormCancel() {
    this.cancelMessage = '¿Deseas deshacer estos cambios?';
    this.showCancelModal = true;
  }

  onModalConfirm() {
    this.showCancelModal = false;
    this.isEditing = false;
    if (this.expForm && this.initialAnimal) {
      try {
        const formData = this.mapAnimalToFormData(this.initialAnimal, this.initialRescate);
        this.expForm.model = { ...formData };
        this.expForm.missingFields = new Set();
      } catch (e) {}
    }
    this.clearImagePreviews();
  }

  onModalCancel() {
    this.showCancelModal = false;
  }

  goToView() {
    if (this.expForm) {
      try {
        this.expForm.model = {};
        this.expForm.missingFields = new Set();
      } catch (e) {}
    }

    this.clearImagePreviews();

    try {
      this.router.navigateByUrl('/expediente/view');
    } catch (e) {}
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.clearImagePreviews();

    const files = Array.from(input.files);
    this.selectedFiles = files;

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const url = URL.createObjectURL(file);
      this.imagePreviews.push(url);
    }
  }

  onAvatarClick(event: Event) {
    if (!this.isEditing) {
      event.preventDefault();
      return;
    }
    try {
      const input = this.avatarInput ? this.avatarInput.nativeElement : null;
      if (!input) return;
      try { input.value = ''; } catch (e) {}
      input.click();
    } catch (err) {
      console.error('error opening file input', err);
    }
  }

  private clearImagePreviews() {
    for (const url of this.imagePreviews) {
      try { URL.revokeObjectURL(url); } catch (e) { }
    }
    this.imagePreviews = [];
    this.selectedFiles = [];
  }

  onSave(data: any) {
    const idExists = this.initialAnimal && this.initialAnimal.id;

    const animalRequest: AnimalRequest = {
      nombre: data.nombre ?? '',
      peso: Number(data.peso) || 0,
      especie: data.especie ?? 'Perro',
      estado: this.animalEstado, 
      raza: data.raza ?? '',
      edad: Number(data.edad) || 0,
      sexo: data.sexo ?? 'Macho',
      rescatistaId: data.rescatistaId || this.getRescatistaIdFromStorage(),
      ...(data.fechaSalida && { fechaSalida: data.fechaSalida })
    };

    const rescateRequest: RescateRequest = {
      lugar: data.lugar ?? '',
      descripcion: data.descripcion ?? ''
    };

    const payload: AnimalRescateRequest = {
      animal: animalRequest,
      rescate: rescateRequest
    };

    const file = this.selectedFiles && this.selectedFiles.length > 0 ? this.selectedFiles[0] : undefined;

    if (idExists) {
      const idStr = this.initialAnimal!.id;
      
      this.api.actualizarConRescateFormData(idStr, payload, file).subscribe(
        (res) => {
          if (res && (res as any).animal) {
            this.initialAnimal = (res as any).animal as Animal;
            if (this.initialAnimal.urlImage) {
              this.imagePreviews = [this.initialAnimal.urlImage];
            }
          }
          this.isEditing = false;
          this.clearImagePreviews();
        }, 
        (err) => {
          console.error('Error actualizando animal con rescate:', err);
        }
      );
    } else {
      this.api.crearConRescateFormData(payload, file).subscribe(
        (res) => {
          if (res && (res as any).animal) {
            this.initialAnimal = (res as any).animal as Animal;
            if (this.initialAnimal.urlImage) {
              this.imagePreviews = [this.initialAnimal.urlImage];
            }
          }
          this.isEditing = false;
          this.clearImagePreviews();
          
          if (this.initialAnimal && this.initialAnimal.id) {
            this.router.navigate(['/expediente/edit', this.initialAnimal.id]);
          }
        }, 
        (err) => {
          console.error('Error creando animal con rescate:', err);
        }
      );
    }
  }

  private getRescatistaIdFromStorage(): string {
    try {
      const token = localStorage.getItem('auth_token');
      if (token && token.split('.').length === 3) {
        const pl = JSON.parse(atob(token.split('.')[1]));
        return pl.sub ?? pl.id ?? pl.userId ?? pl.rescatistaId ?? '';
      }
    } catch (e) {}
    
    const stored = localStorage.getItem('rescatista_id');
    return stored || 'no-encontrado';
  }
}