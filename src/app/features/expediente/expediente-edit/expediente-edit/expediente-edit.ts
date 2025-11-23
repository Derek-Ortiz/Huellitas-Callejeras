import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
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
export class ExpedienteEdit implements OnInit {
  @ViewChild('expForm') expForm?: ExpedienteForm;
  @ViewChild('avatarInput') avatarInput?: ElementRef<HTMLInputElement>;
  isEditing = false;
  pacienteEstado: 'No adoptado' | 'Adoptado' | 'En tratamiento' = 'No adoptado';
  initialPaciente: Paciente | null = null;
  // Archivos seleccionados y sus vistas previas (object URLs)
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  constructor(private pacienteService: PacienteService, private router: Router) {}

  ngOnDestroy(): void {
    // Liberar object URLs
    this.clearImagePreviews();
  }

  ngOnInit(): void {
    const current = this.pacienteService.getCurrent();
    if (current) {
      this.initialPaciente = { ...current };
      this.pacienteEstado = current.estado || this.pacienteEstado;
    } else {
      this.initialPaciente = null;
    }


    try {
      const desired = '/expediente/editar';
      if (this.router.url !== desired) {

        this.router.navigateByUrl(desired, { replaceUrl: false });
      }
    } catch (e) {

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
    // Al cancelar desde el formulario, quitar la funcionalidad de editar
    // (no se borran campos ni previews; solo se desactiva la edición)
    this.isEditing = false;
  }

  goToView() {
    // Limpiar campos del formulario (dejarlos vacíos) y marcas de error
    if (this.expForm) {
      try {
        this.expForm.model = {};
        this.expForm.missingFields = new Set();
      } catch (e) {
        // no bloquear si falla
      }
    }

    // Limpiar previews de imagen en memoria
    this.clearImagePreviews();

    // Navegar a la vista
    try {
      this.router.navigateByUrl('/expediente/view');
    } catch (e) {
      // ignore
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

    const paciente: Paciente = { ...data, estado: this.pacienteEstado } as Paciente;
    this.pacienteService.save(paciente).subscribe((saved: Paciente) => {
      this.isEditing = false;

    }, (err: unknown) => {
    });
  }
}
