import { Component, OnDestroy } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { TreatmentModal } from '../services/treatment-modal';
import { TreatmentStore } from '../services/treatment-store';
import { ConexionApiTratamientos } from '../services/comexion-api-tratamiento';
import { ActivatedRoute } from '@angular/router';
import { SelectedAnimalStore } from '../../../shared/selected-animal.store';
import { Router } from '@angular/router';
import { MedicineModalSwitch } from '../services/medicine-modal';

@Component({
  selector: 'app-tratamiento',
  standalone: false,
  templateUrl: './tratamiento.html',
  styleUrl: './tratamiento.css',
})
export class Tratamiento implements OnDestroy {
  modalTreatmentEditOpen = false;
  modalMedicineOpen = false;
  tratamientos: any[] = [];
  showDeleteConfirm = false;
  showDeleteMedicineConfirm = false;
  selectedTreatmentId?: string;
  selectedTratamiento: any | null = null;
  selectedMedicamentos: Array<{ nombre: string; id: string; idShort: string; fechaConclusion?: string; dosis?: string; repeticion?: string; isNew?: boolean }> = [];
  loading = false;
  unsavedChanges = false;
  selectedFile: File | null = null; // archivo actual (si se reemplaza)
  existingFileName: string | null = null; // nombre del archivo (receta) original
  fileMissing = false; // indica que se debe re-subir archivo
  deletingMedicineIndex: number | null = null;
  editingMedicineIndex: number | null = null;
  currentInitial?: { medicamento?: string; fecha?: string; dosis?: string; repeticion?: string };
  private routeSub?: Subscription;

  constructor(
    private modalSS: TreatmentModal,
    private router: Router,
    private store: TreatmentStore,
    private api: ConexionApiTratamientos,
    private route: ActivatedRoute,
    // Removed CurrentAnimalStub usage; rely on route param or SelectedAnimalStore
    private medicineSwitch: MedicineModalSwitch,
  ) { }

  ngOnInit() {
    this.modalSS.$modalTreatment.subscribe((v: boolean) => this.modalTreatmentEditOpen = v);
    this.medicineSwitch.$modalMedicine.subscribe(v => this.modalMedicineOpen = !!v);

    // React to route param/query changes so data loads immediately on enter and on navigation within module
    this.routeSub = this.route.paramMap.subscribe(pm => {
      const animalId = pm.get('animalId') || SelectedAnimalStore.get() || '';
      const tid = this.route.snapshot.queryParamMap.get('tid') || undefined;
      if (tid) {
        this.selectedTreatmentId = tid;
      }
      this.loadTratamientos(animalId);
    });
  }

  ngOnDestroy(): void {
    try { this.routeSub?.unsubscribe(); } catch { }
  }

  private loadTratamientos(animalId: string) {
    console.log('[Tratamiento] Cargando tratamientos para animal', animalId);
    this.api.obtenerTratamientosPorAnimal(animalId).subscribe({
      next: ts => {
        console.log('[Tratamiento] Lista recibida:', ts);
        this.tratamientos = ts;
        if (this.selectedTreatmentId) {
          this.onChipClick(this.selectedTreatmentId);
        } else if (ts.length > 0) {
          this.onChipClick(ts[0].id);
        }
      },
      error: err => {
        console.error('[Tratamiento] Error obteniendo tratamientos, usando fallback local', err);
        const fallbackAnimalId = SelectedAnimalStore.get() || '';
        this.tratamientos = this.store.getAll().map(t => ({ id: String(t.id), fechaInicio: t.startDate, receta: null, animalId: fallbackAnimalId, medicamentos: [] }));
        if (this.selectedTreatmentId) {
          this.onChipClick(this.selectedTreatmentId);
        } else if (this.tratamientos.length > 0) {
          this.onChipClick(this.tratamientos[0].id);
        }
      }
    });
  }

  onChipClick(id: string) {
    console.log('[Tratamiento] Seleccionando', id);
    this.selectedTreatmentId = id;
    this.fileMissing = false;
    this.loading = true;
    this.api.getTratamientoPorId(id).subscribe({
      next: t => {
        console.log('[Tratamiento] Detalle recibido:', t);
        this.selectedTratamiento = t;
        this.existingFileName = (t as any)?.receta || null;
        this.api.getMedicamentosByTratamiento(id).subscribe({
          next: meds => {
            console.log('[Tratamiento] Medicamentos recibidos:', meds);
            this.selectedMedicamentos = (Array.isArray(meds) ? meds : []).map((m: any) => {
              const idStr = String(m.id ?? '');
              const idShort = idStr.slice(0, 6);
              return {
                nombre: m.nombre,
                id: idStr,
                idShort,
                fechaConclusion: m.fechaConclusion,
                dosis: m.dosis,
                repeticion: m.repeticion,
                isNew: false,
              };
            });
            this.loading = false;
          },
          error: e => { console.error('[Tratamiento] Error medicamentos', e); this.selectedMedicamentos = []; this.loading = false; }
        });
      },
      error: e => {
        console.error('[Tratamiento] Error detalle tratamiento', e);
        this.selectedTratamiento = null;
        this.selectedMedicamentos = [];
        this.loading = false;
      }
    });
  }

  onChipDelete(id: string) {
    this.selectedTreatmentId = id;
    this.showDeleteConfirm = true;
  }
  confirmDelete() {
    if (this.selectedTreatmentId) {
      const id = this.selectedTreatmentId;
      this.api.eliminarTratamiento(id).subscribe({
        next: () => {
          this.tratamientos = this.tratamientos.filter(t => t.id !== id);
        },
        error: () => {
          this.tratamientos = this.tratamientos.filter(t => t.id !== id);
        }
      });
    }
    this.showDeleteConfirm = false;
    this.selectedTreatmentId = undefined;
    this.selectedTratamiento = null;
    this.selectedMedicamentos = [];
  }
  cancelDelete() { this.showDeleteConfirm = false; }

  removeMedicine(i: number) {
    this.deletingMedicineIndex = i;
    this.showDeleteMedicineConfirm = true;
  }
  confirmDeleteMedicine() {
    if (this.deletingMedicineIndex !== null) {
      this.selectedMedicamentos.splice(this.deletingMedicineIndex, 1);
    }
    this.deletingMedicineIndex = null;
    this.showDeleteMedicineConfirm = false;
    // Al eliminar un medicamento, marcar cambios sin guardar para habilitar el botón Guardar
    this.unsavedChanges = true;
  }
  cancelDeleteMedicine() { this.deletingMedicineIndex = null; this.showDeleteMedicineConfirm = false; }

  openAddMedicineModal() {
    this.editingMedicineIndex = null;
    this.currentInitial = undefined;
    this.medicineSwitch.open();
  }

  openEditMedicineModal(i: number) {
    this.editingMedicineIndex = i;
    const med = this.selectedMedicamentos[i];
    // currentInitial solo contiene campos esperados por el modal; el id lo pasamos por una propiedad auxiliar
    (this.currentInitial as any) = {
      medicamento: med.nombre,
      fecha: med.fechaConclusion,
      dosis: med.dosis,
      repeticion: med.repeticion,
    };
    // Adjuntar id por separado para que el modal pueda realizar PUT si cambia el nombre
    (this.currentInitial as any).id = med.id;
    this.medicineSwitch.open();
  }

  onMedicineSaved(payload: { medicamento: string; fecha: string; dosis: string; repeticion: string }) {
    // Si estamos editando un medicamento existente
    if (this.editingMedicineIndex !== null) {
      const prev = this.selectedMedicamentos[this.editingMedicineIndex];
      const nombreCambio = (prev.nombre || '') !== (payload.medicamento || '');
      const otrosCambios = (prev.fechaConclusion || '') !== (payload.fecha || '')
        || (String(prev.dosis || '') !== String(payload.dosis || ''))
        || (String(prev.repeticion || '') !== String(payload.repeticion || ''));

      // Actualizar nombre inmediatamente en el backend si cambió
      if (nombreCambio && prev.id) {
        console.log('[Tratamiento] Actualizando nombre de medicamento via PUT:', prev.id, '->', payload.medicamento);
        this.api.actualizarMedicamento(prev.id, { nombre: payload.medicamento } as any).subscribe({
          next: (res) => console.log('[Tratamiento] Medicamento actualizado:', res),
          error: (e) => console.error('[Tratamiento] Error actualizando medicamento:', e)
        });
      }

      // Actualizar en memoria
      this.selectedMedicamentos[this.editingMedicineIndex] = {
        ...prev,
        nombre: payload.medicamento,
        fechaConclusion: payload.fecha,
        dosis: payload.dosis,
        repeticion: payload.repeticion,
        isNew: prev.isNew, // conservar estado
      };
      this.editingMedicineIndex = null;

      // Si hubo cambios en campos del tratamiento, requerirá PUT del tratamiento
      if (otrosCambios) {
        this.unsavedChanges = true;
      }
    } else {
      // Nuevo medicamento en la lista local (se creará en PUT del tratamiento)
      const data = {
        nombre: payload.medicamento,
        id: '', // se obtiene al crear
        idShort: '',
        fechaConclusion: payload.fecha,
        dosis: payload.dosis,
        repeticion: payload.repeticion,
        isNew: true,
      };
      this.selectedMedicamentos.push(data);
      this.unsavedChanges = true;
    }

    this.currentInitial = undefined;
    this.medicineSwitch.close();
  }

  async updateTratamiento() {
    if (!this.selectedTreatmentId || !this.selectedTratamiento) return;
    try {
      this.loading = true;
      console.log('[Tratamiento] Iniciando actualización PUT para', this.selectedTreatmentId);
      // Crear medicamentos nuevos (sin id)
      for (let i = 0; i < this.selectedMedicamentos.length; i++) {
        const m = this.selectedMedicamentos[i];
        if (!m.id) {
          const creado = await firstValueFrom(this.api.crearMedicamento({ nombre: m.nombre } as any));
          m.id = String((creado as any).id);
          m.idShort = m.id.slice(0, 6);
          console.log('[Tratamiento] Medicamento creado para update:', creado);
        }
        m.isNew = false; // ya persistido
      }
      const animalId = this.route.snapshot.paramMap.get('animalId') || SelectedAnimalStore.get() || '';
      // Normalizar fecha inicio a formato ISO terminado en Z si no lo está
      const fechaInicioRaw = this.selectedTratamiento.fechaInicio || new Date().toISOString();
      const fechaInicio = fechaInicioRaw.includes('T') ? fechaInicioRaw : (fechaInicioRaw + 'T00:00:00Z');
      const medicamentosPayload = this.selectedMedicamentos.map(m => ({
        medicamentoId: m.id,
        nombre: m.nombre,
        dosis: parseFloat(m.dosis || '0') || 0.0,
        repeticion: parseFloat(m.repeticion || '0') || 0.0,
        fechaConclusion: (m.fechaConclusion && m.fechaConclusion.includes('T') ? m.fechaConclusion : (m.fechaConclusion ? m.fechaConclusion + 'T00:00:00Z' : fechaInicio))
      }));
      const formPayload: any = {
        animalId,
        fechaInicio,
        medicamentos: medicamentosPayload,
      };
      console.log('[Tratamiento] PUT FormData tratamiento JSON:', JSON.stringify(formPayload, null, 2));
      if (!this.selectedFile) {
        console.warn('[Tratamiento] Enviando PUT sin nuevo archivo (se mantiene el anterior en backend si es permitido).');
      }
      const updated = await firstValueFrom(this.api.actualizarTratamientoFormData(this.selectedTreatmentId, formPayload, this.selectedFile || undefined));
      console.log('[Tratamiento] Tratamiento actualizado respuesta:', updated);
      this.unsavedChanges = false;
    } catch (err) {
      console.error('[Tratamiento] Error al actualizar tratamiento:', err);
    } finally {
      this.loading = false;
    }
  }

  onFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = (input.files && input.files[0]) ? input.files[0] : null;
    if (file) {
      this.selectedFile = file;
      this.unsavedChanges = true;
      console.log('[Tratamiento] Archivo seleccionado para actualización:', file.name);
      this.fileMissing = false;
    }
  }

  navigateHome() {
    const animalId = this.route.snapshot.paramMap.get('animalId') || SelectedAnimalStore.get() || '';
    if (animalId) {
      this.router.navigate(['/expediente/editar', animalId]);
    } else {
      this.router.navigateByUrl('/expediente');
    }
  }
  goToAddTreatment() { this.router.navigate(['/medicine', 'tratamiento', 'add-treatment']); }
  
  goToAddTreatmentForAnimal() {
    const animalId = this.route.snapshot.paramMap.get('animalId') || SelectedAnimalStore.get() || '';
    if (animalId) {
      this.router.navigate(['/medicine/tratamiento', animalId, 'add-treatment']);
    }
  }

  
  getSelectedIndex(): number {
    if (!this.selectedTreatmentId || !Array.isArray(this.tratamientos)) return 0;
    const idx = this.tratamientos.findIndex(tt => tt?.id === this.selectedTreatmentId);
    return idx >= 0 ? (idx + 1) : 0;
  }

  getDeleteMedicineMessage(): string {
    if (this.deletingMedicineIndex === null) return '¿Deseas eliminar este medicamento?';
    const med = this.selectedMedicamentos[this.deletingMedicineIndex];
    const nombre = med?.nombre ? med.nombre : 'este medicamento';
    return `¿Deseas eliminar ${nombre}?`;
  }
}
