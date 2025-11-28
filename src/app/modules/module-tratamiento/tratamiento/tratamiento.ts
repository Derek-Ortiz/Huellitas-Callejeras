import { Component } from '@angular/core';
import { TreatmentModal } from '../services/treatment-modal';
import { TreatmentStore } from '../services/treatment-store';
import { Router } from '@angular/router';
import { MedicineModalSwitch } from '../services/medicine-modal';

@Component({
  selector: 'app-tratamiento',
  standalone: false,
  templateUrl: './tratamiento.html',
  styleUrl: './tratamiento.css',
})
export class Tratamiento {
  modalTreatmentEditOpen: boolean = false;
  modalMedicineOpen: boolean = false;
  nums: number[] = [1, 2, 3, 4];
  showDeleteConfirm = false;
  showDeleteMedicineConfirm = false;
  selectedTreatment?: number;
  loading = false;
  startDate: string = '';
  // medicines shown in this view
  medicines: Array<{ name: string; date: string; dose: string; repetition: string }> = [];
  deletingMedicineIndex: number | null = null;

  constructor(
    private modalSS: TreatmentModal,
    private router: Router,
    private store: TreatmentStore,
    private medicineSwitch: MedicineModalSwitch,
  ) { }
  ngOnInit() {
    this.modalSS.$modalTreatment.subscribe((valor) => {
      this.modalTreatmentEditOpen = valor;
    });
    this.medicineSwitch.$modalMedicine.subscribe((valor) => {
      this.modalMedicineOpen = !!valor;
    });
    // refresh list from store
    this.nums = this.store.getAll().map(t=> t.id);

  }

  onChipClick(num: number){
    this.selectedTreatment = num;
    this.loading = true;
    setTimeout(() => {
      // simulate fetched data
      this.startDate = '20-11-2025';
      this.loading = false;
    }, 600);
  }

  onChipDelete(num: number){
    this.selectedTreatment = num;
    this.showDeleteConfirm = true;
  }
  confirmDelete(){
    if(this.selectedTreatment!=null){
      this.nums = this.nums.filter(n=> n !== this.selectedTreatment);
    }
    this.showDeleteConfirm = false;
    this.selectedTreatment = undefined;
  }
  cancelDelete(){
    this.showDeleteConfirm = false;
  }
  // Delete medicine with confirmation
  removeMedicine(i: number){
    this.deletingMedicineIndex = i;
    this.showDeleteMedicineConfirm = true;
  }
  confirmDeleteMedicine(){
    if(this.deletingMedicineIndex !== null){
      this.medicines.splice(this.deletingMedicineIndex, 1);
    }
    this.deletingMedicineIndex = null;
    this.showDeleteMedicineConfirm = false;
  }
  cancelDeleteMedicine(){
    this.deletingMedicineIndex = null;
    this.showDeleteMedicineConfirm = false;
  }
  // Open modal to add medicine in this view
  openAddMedicineModal() {
    this.modalMedicineOpen = true;
  }
  // Handle modal save
  onMedicineSaved(payload: { medicamento: string; fecha: string; dosis: string; repeticion: string }) {
    this.medicines.push({
      name: payload.medicamento,
      date: payload.fecha,
      dose: payload.dosis,
      repetition: payload.repeticion,
    });
    this.modalMedicineOpen = false;
  }

  navigateHome(){
    this.router.navigateByUrl('/');
  }

  goToAddTreatment(){
    this.router.navigate(['/medicine','tratamiento','add-treatment']);
  }

}
