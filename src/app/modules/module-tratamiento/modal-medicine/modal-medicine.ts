import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicineModalSwitch } from '../services/medicine-modal';


@Component({
  selector: 'app-modal-medicine',
  standalone: false,
  templateUrl: './modal-medicine.html',
  styleUrl: './modal-medicine.css',
})
export class ModalMedicine {
  form: FormGroup;
  submitted = false;
  @Input() initial?: { medicamento?: string; fecha?: string; dosis?: string; repeticion?: string };
  @Output() saved = new EventEmitter<{ medicamento: string; fecha: string; dosis: string; repeticion: string }>();

  constructor(private modalSS: MedicineModalSwitch, private fb: FormBuilder ) {
    this.form = this.fb.group({
      medicamento: ['', Validators.required],
      fecha: ['', Validators.required],
      dosis: ['', Validators.required],
      repeticion: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.initial) {
      this.form.patchValue({
        medicamento: this.initial.medicamento || '',
        fecha: this.initial.fecha || '',
        dosis: this.initial.dosis || '',
        repeticion: this.initial.repeticion || '',
      });
    }
  }

  closeModalMedicineEdit() { this.modalSS.$modalMedicine.emit(false); }

  submit() {
    this.submitted = true;
    if (this.form.invalid) { return; }
    this.saved.emit(this.form.value);
    this.modalSS.$modalMedicine.emit(false);
  }
}
