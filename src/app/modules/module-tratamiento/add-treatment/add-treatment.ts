import { Component } from '@angular/core';
import { TreatmentModal } from '../services/treatment-modal';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TreatmentStore } from '../services/treatment-store';
import { Router } from '@angular/router';
import { MedicineModalSwitch } from '../services/medicine-modal';

@Component({
  selector: 'app-add-treatment',
  standalone: false,
  templateUrl: './add-treatment.html',
  styleUrl: './add-treatment.css',
})
export class AddTreatment {
  modalTreatmentEditOpen: boolean = false;
  modalMedicineOpen: boolean = false;
  showDeleteConfirm = false;
  nums: number[] = [1, 2, 3, 4, 5];
  form: FormGroup;
  submitted = false;
  get medicines(): FormArray { return this.form.get('medicines') as FormArray; }
  // track edit state
  editingIndex: number | null = null;
  currentInitial?: { medicamento?: string; fecha?: string; dosis?: string; repeticion?: string };
  deletingIndex: number | null = null;

  constructor(
    private modalSS: TreatmentModal,
    private fb: FormBuilder,
    private store: TreatmentStore,
    private router: Router,
    private medicineSwitch: MedicineModalSwitch,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      prescriptionFile: [''], // optional
      medicines: this.fb.array([]),
    });
  }
  ngOnInit() {
    this.modalSS.$modalTreatment.subscribe((valor) => {
      this.modalTreatmentEditOpen = valor;
    });
    // close/open medicine modal via shared switch
    this.medicineSwitch.$modalMedicine.subscribe((valor) => {
      this.modalMedicineOpen = !!valor;
    });
  }
  OpenModalTreatmentEdit1() {
      this.modalTreatmentEditOpen = !this.modalTreatmentEditOpen; 
    }
  // Open modal to add
  openAddMedicineModal() {
    this.editingIndex = null;
    this.currentInitial = undefined;
    this.modalMedicineOpen = true;
  }

  // Open modal to edit
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

  // Handle modal save
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
      this.medicines.push(this.fb.group({
        name: [data.name, Validators.required],
        date: [data.date, Validators.required],
        dose: [data.dose, Validators.required],
        repetition: [data.repetition, Validators.required],
      }));
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

  save() {
    this.submitted = true;
    if (this.form.invalid) { return; }
    const { name, startDate, prescriptionFile, medicines } = this.form.value;
    this.store.addTop({ name, startDate, prescriptionFile, medicines });
    this.router.navigate(['/medicine','tratamiento']);
  }
   navigateHome(){
    this.router.navigateByUrl('/');
  }

}
