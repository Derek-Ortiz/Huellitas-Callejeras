import { Component, OnInit, ViewChild, OnDestroy, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConexionApiAnimales } from '../../services/conexion-api-animales';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../interfaces/paciente.interface';
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
  pacienteEstado: 'No adoptado' | 'Adoptado' | 'En tratamiento' = 'No adoptado';
  initialPaciente: Paciente | null = null;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  showCancelModal = false;
  cancelMessage = '';

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute,
    private api: ConexionApiAnimales,
    private cdr: ChangeDetectorRef
  ) {}
  private routeSub?: Subscription;

  ngOnInit(): void {
    // Suscribirse a cambios en los parámetros de ruta para cargar automáticamente cuando cambie :id
    this.routeSub = this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (id) {
        this.loadById(id);
      } else {
        // Si no hay id en ruta, usar current del servicio en memoria (sin activar edición automática)
        const current = this.pacienteService.getCurrent();
        if (current) {
          this.initialPaciente = { ...current };
          this.pacienteEstado = current.estado || this.pacienteEstado;
        } else {
          this.initialPaciente = null;
        }
      }
      console.log('ExpedienteEdit paramMap changed - idParam:', id);
    });
  }

  ngAfterViewInit(): void {
    // Si ya tenemos el paciente inicial, poblar el formulario después de que la vista esté lista
    if (this.expForm && this.initialPaciente) {
      try { this.expForm.model = { ...this.initialPaciente }; } catch (e) {}
    }
  }

  private loadById(idParam: string) {
    // Usar endpoint que devuelve animal + rescate cuando esté disponible
    this.api.getConRescate(idParam).subscribe(
      (res) => {
        // `res` puede ser { animal, rescate } o directamente el animal
        let animal: any = res;
        let rescate: any = {};
        if (res && (res as any).animal) {
          animal = (res as any).animal;
          rescate = (res as any).rescate || {};
        }
        if (!animal) return;

        const toStr = (v: any) => v === undefined || v === null ? '' : String(v);
        const rawEstado = (animal as any)['estado'];
        const normalizeEstado = (val: any): 'No adoptado' | 'Adoptado' | 'En tratamiento' => {
          if (!val) return 'No adoptado';
          const s = String(val).toLowerCase();
          if (s.includes('adopt')) return 'Adoptado';
          if (s.includes('recuper') || s.includes('trat') || s.includes('en ')) return 'En tratamiento';
          if (s.includes('no')) return 'No adoptado';
          return 'No adoptado';
        };

        const formatDate = (v: any) => {
          if (v === undefined || v === null || String(v).trim() === '') return '';
          const s = String(v);
          if (s.includes('T')) return s.split('T')[0];
          try {
            const d = new Date(s);
            if (isNaN(d.getTime())) return '';
            return d.toISOString().slice(0, 10);
          } catch (e) {
            return '';
          }
        };

        const sexoRaw = toStr((animal as any)['sexo']).toLowerCase();
        const sexoNorm = sexoRaw.includes('m') ? 'macho' : (sexoRaw.includes('h') ? 'hembra' : '');

        const merged = { ...animal, ...rescate };

        const paciente: Paciente = {
          id: animal.id ? (typeof animal.id === 'string' ? undefined : Number(animal.id)) : (animal.id ? Number(String(animal.id)) : undefined),
          nombre: toStr(animal.nombre),
          especie: toStr((animal as any)['especie']),
          raza: toStr((animal as any)['raza']),
          edad: toStr((animal as any)['edad']),
          sexo: sexoNorm,
          peso: toStr((merged as any)['peso']),
          fechaIngreso: formatDate((merged as any)['fechaIngreso']),
          fechaSalida: formatDate((merged as any)['fechaSalida']),
          lugar: toStr((merged as any)['lugar']),
          descripcion: toStr((merged as any)['descripcion']),
          estado: normalizeEstado(rawEstado),
          urlImage: toStr((merged as any)['urlImage'] || (merged as any)['imageUrl'] || ''),
          rescatistaId: toStr((merged as any)['rescatistaId'] || '')
        } as Paciente;

        this.initialPaciente = paciente;
        this.pacienteEstado = paciente.estado;
        // Mantener el formulario bloqueado al cargar por id; el usuario debe pulsar "Editar" para habilitar
        this.isEditing = false;

        const urlImg = (merged as any)['urlImage'] || (merged as any)['imageUrl'] || (merged as any)['url'] || undefined;
        if (urlImg && String(urlImg).trim() !== '') {
          console.log('ExpedienteEdit - asignando imagePreviews desde carga:', urlImg);
          this.imagePreviews = [String(urlImg)];
        }

        if (this.expForm) {
          try {
            // asignar initial y model al formulario hijo pero mantenerlo disabled
            try { (this.expForm as any).initial = { ...paciente }; } catch (e) {}
            try { this.expForm.model = { ...paciente }; } catch (e) {}
            // no tocar `disabled` aquí para que los inputs permanezcan bloqueados
          } catch (e) { }
        }

        // Forzar detección de cambios para que Angular actualice la plantilla inmediatamente
        try { this.cdr.detectChanges(); } catch (e) {}
      },
      (err) => {
        console.error('Error cargando paciente por id:', err);
      }
    );
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
      } catch (e) {
      }
    }

    this.isEditing = !this.isEditing;
  }

  onEstadoChange(nuevo: 'No adoptado' | 'Adoptado' | 'En tratamiento') {
    this.pacienteEstado = nuevo;
  }

  onTratamientos() {
    if (this.expForm) {
      if ((this.expForm as any).disabled) {
        return;
      }
      this.expForm.onSubmit();
    } else {
    }
  }

  onFormCancel() {
    this.cancelMessage = '¿Deseas deshacer estos cambios?';
    this.showCancelModal = true;
  }

  onModalConfirm() {
    this.showCancelModal = false;
    this.isEditing = false;
    if (this.expForm) {
      try {
        this.expForm.model = this.initialPaciente ? { ...this.initialPaciente } : {};
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
      } catch (e) {
      }
    }

    this.clearImagePreviews();

    try {
      this.router.navigateByUrl('/expediente/view');
    } catch (e) {
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('onFilesSelected called, files:', input.files);
    if (!input.files || input.files.length === 0) return;

    this.clearImagePreviews();

    const files = Array.from(input.files);
    this.selectedFiles = files;

    for (const file of files) {
      console.log('file selected:', file.name, file.type, file.size);
      if (!file.type.startsWith('image/')) continue;
      const url = URL.createObjectURL(file);
      this.imagePreviews.push(url);
    }
    console.log('imagePreviews now:', this.imagePreviews);
  }

  onAvatarClick(event: Event) {
    if (!this.isEditing) {
      event.preventDefault();
      return;
    }
    try {
      const input = this.avatarInput ? this.avatarInput.nativeElement : null;
      console.log('onAvatarClick, isEditing=', this.isEditing, 'inputExists=', !!input);
      if (!input) return;
      try { input.value = ''; } catch (e) {}
      input.click();
      console.log('file input clicked');
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
    const payload: any = { ...data, estado: this.mapEstadoToBackend(this.pacienteEstado) };

    const idExists = this.initialPaciente && this.initialPaciente.id != null;

    if (idExists) {
      const idStr = String(this.initialPaciente!.id);
      const animalReq = { animal: payload, rescate: {
        fechaIngreso: payload.fechaIngreso,
        lugar: payload.lugar,
        descripcion: payload.descripcion
      }};
      // Si falta rescatistaId, intentar extraerlo del token JWT o localStorage
      if (!animalReq.animal.rescatistaId) {
        try {
          const token = localStorage.getItem('auth_token');
          if (token && token.split('.').length === 3) {
            const pl = JSON.parse(atob(token.split('.')[1]));
            animalReq.animal.rescatistaId = pl.sub ?? pl.id ?? pl.userId ?? pl.rescatistaId ?? animalReq.animal.rescatistaId;
          }
        } catch (e) {}
        if (!animalReq.animal.rescatistaId) {
          const stored = localStorage.getItem('rescatista_id');
          if (stored) animalReq.animal.rescatistaId = stored;
        }
      }

      const file = this.selectedFiles && this.selectedFiles.length > 0 ? this.selectedFiles[0] : undefined;
      this.api.actualizarConRescateFormData(idStr, animalReq, file).subscribe(
        (res) => {
          console.log('Actualizado con respuesta:', res);
          // Si la API devuelve data.animal.urlImage, usarla
          const url = (res && (res as any).animal && (res as any).animal.urlImage) ? (res as any).animal.urlImage : ((res && (res as any).urlImage) ? (res as any).urlImage : undefined);
          if (url) this.imagePreviews = [url];
          this.isEditing = false;
        }, (err) => {
          console.error('Error actualizando animal con rescate:', err);
        }
      );
    } else {
      const animalReq = { animal: payload, rescate: {
        fechaIngreso: payload.fechaIngreso,
        lugar: payload.lugar,
        descripcion: payload.descripcion
      }};
      // Si falta rescatistaId, intentar extraerlo del token JWT o localStorage
      if (!animalReq.animal.rescatistaId) {
        try {
          const token = localStorage.getItem('auth_token');
          if (token && token.split('.').length === 3) {
            const pl = JSON.parse(atob(token.split('.')[1]));
            animalReq.animal.rescatistaId = pl.sub ?? pl.id ?? pl.userId ?? pl.rescatistaId ?? animalReq.animal.rescatistaId;
          }
        } catch (e) {}
        if (!animalReq.animal.rescatistaId) {
          const stored = localStorage.getItem('rescatista_id');
          if (stored) animalReq.animal.rescatistaId = stored;
        }
      }
      const file = this.selectedFiles && this.selectedFiles.length > 0 ? this.selectedFiles[0] : undefined;

      this.api.crearConRescateFormData(animalReq, file).subscribe(
        (res) => {
          console.log('Creado con respuesta:', res);
          const url = (res && (res as any).animal && (res as any).animal.urlImage) ? (res as any).animal.urlImage : ((res && (res as any).urlImage) ? (res as any).urlImage : undefined);
          if (url) this.imagePreviews = [url];
          this.isEditing = false;
        }, (err) => {
          console.error('Error creando animal con rescate:', err);
        }
      );
    }
  }

  /** Mapear texto de UI a valor canonico esperado por el backend */
  private mapEstadoToBackend(estadoUi: string | undefined | null): 'No adoptado' | 'Adoptado' | 'En recuperación' {
    const s = (estadoUi ?? '').toString().toLowerCase();
    if (s.includes('adopt')) return 'Adoptado';
    if (s.includes('recuper') || s.includes('recuperación') || s.includes('recuperacion')) return 'En recuperación';
    if (s.includes('trat')) return 'En recuperación';
    return 'No adoptado';
  }
}
