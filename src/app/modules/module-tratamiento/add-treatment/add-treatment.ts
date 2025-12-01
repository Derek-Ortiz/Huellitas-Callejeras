import { Component } from '@angular/core';
import { TreatmentModal } from '../services/treatment-modal';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TreatmentStore } from '../services/treatment-store';
import { ConexionApiTratamientos } from '../services/comexion-api-tratamiento';
import { CurrentAnimalStub } from '../services/current-animal.stub';
import { Router } from '@angular/router';
import { MedicineModalSwitch } from '../services/medicine-modal';

@Component({
  selector: 'app-add-treatment',
  standalone: false,
  templateUrl: './add-treatment.html',
  styleUrl: './add-treatment.css',
})
export class AddTreatment {
  modalTreatmentEditOpen = false;
  modalMedicineOpen = false;
  showDeleteConfirm = false;
  nums: number[] = [];
  tratamientos: any[] = [];
  form: FormGroup;
  submitted = false;
  get medicines(): FormArray { return this.form.get('medicines') as FormArray; }
  editingIndex: number | null = null;
  currentInitial?: { medicamento?: string; fecha?: string; dosis?: string; repeticion?: string };
  deletingIndex: number | null = null;
  selectedFile: File | null = null;

  constructor(
    private modalSS: TreatmentModal,
    private fb: FormBuilder,
    private store: TreatmentStore,
    private router: Router,
    private api: ConexionApiTratamientos,
    private currentAnimal: CurrentAnimalStub,
    private medicineSwitch: MedicineModalSwitch,
  ) {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      prescriptionFile: [''],
      medicines: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.modalSS.$modalTreatment.subscribe(v => this.modalTreatmentEditOpen = v);
    this.medicineSwitch.$modalMedicine.subscribe(v => this.modalMedicineOpen = !!v);
    const animalId = this.currentAnimal.getAnimalId();
    this.api.obtenerTratamientosPorAnimal(animalId).subscribe({
      next: ts => {
        this.tratamientos = ts || [];
        this.nums = Array.from({ length: this.tratamientos.length }, (_, i) => i + 1);
      },
      error: err => console.error('[AddTreatment] Error al cargar tratamientos:', err)
    });
  }

  openAddMedicineModal() {
    this.editingIndex = null;
    this.currentInitial = undefined;
    this.modalMedicineOpen = true;
  }

  openEditMedicineModal(index: number) {
    this.editingIndex = index;
    const group = this.medicines.at(index) as FormGroup;
    const v = group.value as any;
    this.currentInitial = {
      medicamento: v.name,
      fecha: v.date,
      dosis: v.dose,
      repeticion: v.repetition,
    };
    this.modalMedicineOpen = true;
  }

  onMedicineSaved(payload: { medicamento: string; fecha: string; dosis: string; repeticion: string }) {
    const data = {
      name: payload.medicamento,
      date: payload.fecha,
      dose: payload.dosis,
      repetition: payload.repeticion,
    };
    if (this.editingIndex !== null) {
      (this.medicines.at(this.editingIndex) as FormGroup).patchValue(data);
    } else {
      this.medicines.push(this.fb.group(data));
    }
    this.editingIndex = null;
    this.currentInitial = undefined;
    this.modalMedicineOpen = false;
  }

  removeMedicine(i: number) {
    this.deletingIndex = i;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.deletingIndex !== null) {
      this.medicines.removeAt(this.deletingIndex);
    }
    this.deletingIndex = null;
    this.showDeleteConfirm = false;
  }

  cancelDelete() {
    this.deletingIndex = null;
    this.showDeleteConfirm = false;
  }

  onFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    this.selectedFile = (input.files && input.files[0]) ? input.files[0] : null;
  }

  private toIso(dateStr: string): string {
    if (!dateStr) return new Date().toISOString();
    return dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00Z';
  }

  save() {
    this.submitted = true;
    if (this.form.invalid) { return; }
    const { startDate } = this.form.value as { startDate: string };
    const animalId = this.currentAnimal.getAnimalId();
    const medsControls = this.medicines.controls.map(fg => fg.value as any);
    if (medsControls.length === 0) {
      console.error('[AddTreatment] Debes agregar al menos un medicamento antes de guardar');
      return;
    }
    console.log('[AddTreatment] Creando medicamentos individualmente en /medicamentos con nombres:', medsControls.map(m => m.name));
    const runSequential = async () => {
      try {
        const createdIds: string[] = [];
        for (const m of medsControls) {
          const created = await this.api.crearMedicamento({ nombre: m.name } as any).toPromise();
          const id = (created as any)?.id;
          console.log('[AddTreatment] Medicamento creado:', created, 'UUID:', id);
          if (!id) { throw new Error('No se recibió UUID del medicamento'); }
          createdIds.push(id);
        }
        const formReqAny: any = {
          animalId,
          fechaInicio: this.toIso(startDate),
          medicamentos: medsControls.map((m, idx) => ({
            medicamentoId: createdIds[idx],
            nombre: m.name,
            dosis: parseFloat(m.dose) || 0.0,
            repeticion: parseFloat(m.repetition) || 0.0,
            fechaConclusion: this.toIso(m.date || startDate),
          })),
        };
        console.log('[AddTreatment] Enviando FormData a /tratamientos JSON:', JSON.stringify(formReqAny, null, 2), 'Archivo:', this.selectedFile);
        this.api.crearTratamientoFormData(formReqAny as any, this.selectedFile || undefined).subscribe({
          next: (res) => {
            console.log('[AddTreatment] Tratamiento creado (form-data):', res);
           
            this.api.obtenerTratamientosPorAnimal(animalId).subscribe({
              next: ts => { this.nums = Array.from({ length: ts.length }, (_, i) => i + 1); },
              error: e => console.error('[AddTreatment] Error refrescando lista tratamientos tras crear:', e)
            });
          },
          error: (err) => {
            console.error('[AddTreatment] Error al crear tratamiento (form-data):', err, (err as any)?.error);
            this.store.addTop({ name: 'Tratamiento', startDate, prescriptionFile: undefined, medicines: [] });
          }
        });
      } catch (e) {
        console.error('[AddTreatment] Error creando medicamentos secuencialmente:', e);
      }
    };
    runSequential();
  }

  navigateHome() { this.router.navigateByUrl('/'); }

  goToTratamiento(tratamientoId: string) {
    // Navegar al root de medicine con el id seleccionado como query param
    this.router.navigate(['/medicine'], { queryParams: { tid: tratamientoId } });
  }
}
