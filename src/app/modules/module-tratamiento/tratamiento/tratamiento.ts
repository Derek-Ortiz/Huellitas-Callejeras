import { Component } from '@angular/core';
import { TreatmentModal } from '../services/treatment-modal';
import { TreatmentStore } from '../services/treatment-store';
import { ConexionApiTratamientos } from '../services/comexion-api-tratamiento';
import { ActivatedRoute } from '@angular/router';
import { CurrentAnimalStub } from '../services/current-animal.stub';
import { Router } from '@angular/router';
import { MedicineModalSwitch } from '../services/medicine-modal';

@Component({
  selector: 'app-tratamiento',
  standalone: false,
  templateUrl: './tratamiento.html',
  styleUrl: './tratamiento.css',
})
export class Tratamiento {
  modalTreatmentEditOpen = false;
  modalMedicineOpen = false;
  tratamientos: any[] = [];
  showDeleteConfirm = false;
  showDeleteMedicineConfirm = false;
  selectedTreatmentId?: string;
  selectedTratamiento: any | null = null;
  selectedMedicamentos: Array<{ nombre: string; id: string; idShort: string; fechaConclusion?: string; dosis?: string; repeticion?: string }> = [];
  loading = false;
  deletingMedicineIndex: number | null = null;
  editingMedicineIndex: number | null = null;
  currentInitial?: { medicamento?: string; fecha?: string; dosis?: string; repeticion?: string };

  constructor(
    private modalSS: TreatmentModal,
    private router: Router,
    private store: TreatmentStore,
    private api: ConexionApiTratamientos,
    private route: ActivatedRoute,
    private currentAnimal: CurrentAnimalStub,
    private medicineSwitch: MedicineModalSwitch,
  ) { }

  ngOnInit() {
    this.modalSS.$modalTreatment.subscribe(v => this.modalTreatmentEditOpen = v);
    this.medicineSwitch.$modalMedicine.subscribe(v => this.modalMedicineOpen = !!v);
    let animalId = this.route.snapshot.paramMap.get('animalId') || this.currentAnimal.getAnimalId();
    this.loadTratamientos(animalId);
  }

  private loadTratamientos(animalId: string) {
    console.log('[Tratamiento] Cargando tratamientos para animal', animalId);
    this.api.obtenerTratamientosPorAnimal(animalId).subscribe({
      next: ts => {
        console.log('[Tratamiento] Lista recibida:', ts);
        this.tratamientos = ts;
        if (!this.selectedTreatmentId && ts.length > 0) {
          this.onChipClick(ts[0].id);
        }
      },
      error: err => {
        console.error('[Tratamiento] Error obteniendo tratamientos, usando fallback local', err);
        this.tratamientos = this.store.getAll().map(t => ({ id: String(t.id), fechaInicio: t.startDate, receta: null, animalId: this.currentAnimal.getAnimalId(), medicamentos: [] }));
        if (!this.selectedTreatmentId && this.tratamientos.length > 0) {
          this.onChipClick(this.tratamientos[0].id);
        }
      }
    });
  }

  onChipClick(id: string) {
    console.log('[Tratamiento] Seleccionando', id);
    this.selectedTreatmentId = id;
    this.loading = true;
    this.api.getTratamientoPorId(id).subscribe({
      next: t => {
        console.log('[Tratamiento] Detalle recibido:', t);
        this.selectedTratamiento = t;
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
  }
  cancelDeleteMedicine() { this.deletingMedicineIndex = null; this.showDeleteMedicineConfirm = false; }

  openAddMedicineModal() { }
  onMedicineSaved(_payload: { medicamento: string; fecha: string; dosis: string; repeticion: string }) { }
  openEditMedicineModal(_i: number) { }

  navigateHome() { this.router.navigateByUrl('/'); }
  goToAddTreatment() { this.router.navigate(['/medicine', 'tratamiento', 'add-treatment']); }

  
  getSelectedIndex(): number {
    if (!this.selectedTreatmentId || !Array.isArray(this.tratamientos)) return 0;
    const idx = this.tratamientos.findIndex(tt => tt?.id === this.selectedTreatmentId);
    return idx >= 0 ? (idx + 1) : 0;
  }
}
