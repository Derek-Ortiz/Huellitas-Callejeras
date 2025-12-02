import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { firstValueFrom, Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  selectedFile: File | null = null;
  existingFileName: string | null = null;
  fileMissing = false;
  deletingMedicineIndex: number | null = null;
  editingMedicineIndex: number | null = null;
  currentInitial?: { medicamento?: string; fecha?: string; dosis?: string; repeticion?: string };
  
  // Polling
  private routeSub?: Subscription;
  private pollingSub?: Subscription;
  private pollingDetailSub?: Subscription;
  private readonly POLLING_INTERVAL = 3000; // 3 segundos
  private currentAnimalId: string = '';

  constructor(
    private modalSS: TreatmentModal,
    private router: Router,
    private store: TreatmentStore,
    private api: ConexionApiTratamientos,
    private route: ActivatedRoute,
    private medicineSwitch: MedicineModalSwitch,
    private cdr: ChangeDetectorRef  // ← AGREGAR
  ) { }

  ngOnInit() {
    this.modalSS.$modalTreatment.subscribe((v: boolean) => {
      this.modalTreatmentEditOpen = v;
      this.cdr.detectChanges();
    });
    
    this.medicineSwitch.$modalMedicine.subscribe(v => {
      this.modalMedicineOpen = !!v;
      this.cdr.detectChanges();
    });

    this.routeSub = this.route.paramMap.subscribe(pm => {
      const animalId = pm.get('animalId') || SelectedAnimalStore.get() || '';
      this.currentAnimalId = animalId;
      const tid = this.route.snapshot.queryParamMap.get('tid') || undefined;
      if (tid) {
        this.selectedTreatmentId = tid;
      }
      this.loadTratamientos(animalId);
      this.iniciarPolling(animalId);
    });
  }

  ngOnDestroy(): void {
    try { this.routeSub?.unsubscribe(); } catch { }
    try { this.pollingSub?.unsubscribe(); } catch { }
    try { this.pollingDetailSub?.unsubscribe(); } catch { }
  }

  private iniciarPolling(animalId: string): void {
    // Detener polling anterior si existe
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
    if (this.pollingDetailSub) {
      this.pollingDetailSub.unsubscribe();
    }

    // Polling para lista de tratamientos
    this.pollingSub = interval(this.POLLING_INTERVAL)
      .pipe(
        switchMap(() => this.api.obtenerTratamientosPorAnimal(animalId))
      )
      .subscribe({
        next: ts => {
          console.log('[Tratamiento Polling] Lista actualizada:', ts.length);
          const previousLength = this.tratamientos.length;
          this.tratamientos = ts;
          
          // Si se agregó un nuevo tratamiento, seleccionarlo automáticamente
          if (ts.length > previousLength && !this.selectedTreatmentId) {
            this.onChipClick(ts[0].id);
          }
          
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('[Tratamiento Polling] Error:', err);
        }
      });

    // Polling para detalle del tratamiento seleccionado
    this.pollingDetailSub = interval(this.POLLING_INTERVAL)
      .subscribe(() => {
        if (this.selectedTreatmentId && !this.modalMedicineOpen && !this.showDeleteConfirm) {
          this.recargarDetalleTratamiento(this.selectedTreatmentId);
        }
      });
  }

  private recargarDetalleTratamiento(id: string): void {
    // No recargar si hay cambios sin guardar o modales abiertos
    if (this.unsavedChanges || this.modalMedicineOpen || this.showDeleteConfirm) {
      return;
    }

    this.api.getTratamientoPorId(id).subscribe({
      next: t => {
        this.selectedTratamiento = t;
        this.existingFileName = (t as any)?.receta || null;
        
        this.api.getMedicamentosByTratamiento(id).subscribe({
          next: meds => {
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
            this.cdr.detectChanges();
          },
          error: e => console.error('[Tratamiento Polling] Error medicamentos', e)
        });
      },
      error: e => console.error('[Tratamiento Polling] Error detalle', e)
    });
  }

  private loadTratamientos(animalId: string) {
    console.log('[Tratamiento] Cargando tratamientos para animal', animalId);
    this.api.obtenerTratamientosPorAnimal(animalId).subscribe({
      next: ts => {
        console.log('[Tratamiento] Lista recibida:', ts);
        this.tratamientos = ts;
        this.cdr.detectChanges();
        
        if (this.selectedTreatmentId) {
          this.onChipClick(this.selectedTreatmentId);
        } else if (ts.length > 0) {
          this.onChipClick(ts[0].id);
        }
      },
      error: err => {
        console.error('[Tratamiento] Error obteniendo tratamientos, usando fallback local', err);
        const fallbackAnimalId = SelectedAnimalStore.get() || '';
        this.tratamientos = this.store.getAll().map(t => ({ 
          id: String(t.id), 
          fechaInicio: t.startDate, 
          receta: null, 
          animalId: fallbackAnimalId, 
          medicamentos: [] 
        }));
        this.cdr.detectChanges();
        
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
    this.cdr.detectChanges();
    
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
            this.cdr.detectChanges();
          },
          error: e => { 
            console.error('[Tratamiento] Error medicamentos', e); 
            this.selectedMedicamentos = []; 
            this.loading = false; 
            this.cdr.detectChanges();
          }
        });
      },
      error: e => {
        console.error('[Tratamiento] Error detalle tratamiento', e);
        this.selectedTratamiento = null;
        this.selectedMedicamentos = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onChipDelete(id: string) {
    this.selectedTreatmentId = id;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  confirmDelete() {
    if (this.selectedTreatmentId) {
      const id = this.selectedTreatmentId;
      this.api.eliminarTratamiento(id).subscribe({
        next: () => {
          console.log('[Tratamiento] Eliminado exitosamente:', id);
          // Eliminar de la lista local inmediatamente
          this.tratamientos = this.tratamientos.filter(t => t.id !== id);
          this.selectedTratamiento = null;
          this.selectedMedicamentos = [];
          this.selectedTreatmentId = undefined;
          
          // Seleccionar el primer tratamiento si existe
          if (this.tratamientos.length > 0) {
            this.onChipClick(this.tratamientos[0].id);
          }
          
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[Tratamiento] Error al eliminar:', err);
          // Eliminar de la lista local de todas formas
          this.tratamientos = this.tratamientos.filter(t => t.id !== id);
          this.selectedTratamiento = null;
          this.selectedMedicamentos = [];
          this.selectedTreatmentId = undefined;
          this.cdr.detectChanges();
        }
      });
    }
    this.showDeleteConfirm = false;
    this.cdr.detectChanges();
  }

  cancelDelete() { 
    this.showDeleteConfirm = false; 
    this.cdr.detectChanges();
  }

  removeMedicine(i: number) {
    this.deletingMedicineIndex = i;
    this.showDeleteMedicineConfirm = true;
    this.cdr.detectChanges();
  }

  confirmDeleteMedicine() {
    if (this.deletingMedicineIndex !== null) {
      this.selectedMedicamentos.splice(this.deletingMedicineIndex, 1);
      this.unsavedChanges = true;
    }
    this.deletingMedicineIndex = null;
    this.showDeleteMedicineConfirm = false;
    this.cdr.detectChanges();
  }

  cancelDeleteMedicine() { 
    this.deletingMedicineIndex = null; 
    this.showDeleteMedicineConfirm = false; 
    this.cdr.detectChanges();
  }

  openAddMedicineModal() {
    this.editingMedicineIndex = null;
    this.currentInitial = undefined;
    this.medicineSwitch.open();
  }

  openEditMedicineModal(i: number) {
    this.editingMedicineIndex = i;
    const med = this.selectedMedicamentos[i];
    (this.currentInitial as any) = {
      medicamento: med.nombre,
      fecha: med.fechaConclusion,
      dosis: med.dosis,
      repeticion: med.repeticion,
    };
    (this.currentInitial as any).id = med.id;
    this.medicineSwitch.open();
  }

  onMedicineSaved(payload: { medicamento: string; fecha: string; dosis: string; repeticion: string }) {
    if (this.editingMedicineIndex !== null) {
      const prev = this.selectedMedicamentos[this.editingMedicineIndex];
      const nombreCambio = (prev.nombre || '') !== (payload.medicamento || '');
      const otrosCambios = (prev.fechaConclusion || '') !== (payload.fecha || '')
        || (String(prev.dosis || '') !== String(payload.dosis || ''))
        || (String(prev.repeticion || '') !== String(payload.repeticion || ''));

      if (nombreCambio && prev.id) {
        console.log('[Tratamiento] Actualizando nombre de medicamento via PUT:', prev.id, '->', payload.medicamento);
        this.api.actualizarMedicamento(prev.id, { nombre: payload.medicamento } as any).subscribe({
          next: (res) => {
            console.log('[Tratamiento] Medicamento actualizado:', res);
            this.cdr.detectChanges();
          },
          error: (e) => console.error('[Tratamiento] Error actualizando medicamento:', e)
        });
      }

      this.selectedMedicamentos[this.editingMedicineIndex] = {
        ...prev,
        nombre: payload.medicamento,
        fechaConclusion: payload.fecha,
        dosis: payload.dosis,
        repeticion: payload.repeticion,
        isNew: prev.isNew,
      };
      this.editingMedicineIndex = null;

      if (otrosCambios) {
        this.unsavedChanges = true;
      }
    } else {
      const data = {
        nombre: payload.medicamento,
        id: '',
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
    this.cdr.detectChanges();
  }

  async updateTratamiento() {
    if (!this.selectedTreatmentId || !this.selectedTratamiento) return;
    try {
      this.loading = true;
      this.cdr.detectChanges();
      
      console.log('[Tratamiento] Iniciando actualización PUT para', this.selectedTreatmentId);
      
      for (let i = 0; i < this.selectedMedicamentos.length; i++) {
        const m = this.selectedMedicamentos[i];
        if (!m.id) {
          const creado = await firstValueFrom(this.api.crearMedicamento({ nombre: m.nombre } as any));
          m.id = String((creado as any).id);
          m.idShort = m.id.slice(0, 6);
          console.log('[Tratamiento] Medicamento creado para update:', creado);
        }
        m.isNew = false;
      }
      
      const animalId = this.route.snapshot.paramMap.get('animalId') || SelectedAnimalStore.get() || '';
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
      this.cdr.detectChanges();
    } catch (err) {
      console.error('[Tratamiento] Error al actualizar tratamiento:', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
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
      this.cdr.detectChanges();
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

  goToAddTreatment() { 
    this.router.navigate(['/medicine', 'tratamiento', 'add-treatment']); 
  }
  
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