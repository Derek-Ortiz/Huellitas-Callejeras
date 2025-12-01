import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicineModalSwitch } from '../services/medicine-modal';
import { ConexionApiTratamientos } from '../services/comexion-api-tratamiento';


@Component({
  selector: 'app-modal-medicine',
  standalone: false,
  templateUrl: './modal-medicine.html',
  styleUrl: './modal-medicine.css',
})
export class ModalMedicine {
  form: FormGroup;
  submitted = false;
  @Input() initial?: { id?: string; medicamento?: string; fecha?: string; dosis?: string; repeticion?: string };
  @Output() saved = new EventEmitter<{ medicamento: string; fecha: string; dosis: string; repeticion: string }>();

  constructor(private modalSS: MedicineModalSwitch, private fb: FormBuilder, private api: ConexionApiTratamientos ) {
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
    const value = this.form.value as { medicamento: string; fecha: string; dosis: string; repeticion: string };
    // Si el modal está en modo edición y cambió el nombre, hacer PUT inmediato
    if (this.initial?.id && (this.initial.medicamento || '') !== value.medicamento) {
      this.api.actualizarMedicamento(this.initial.id, { nombre: value.medicamento } as any).subscribe({
        next: () => {},
        error: (e) => console.error('[ModalMedicine] Error actualizando nombre de medicamento:', e)
      });
    }
    this.saved.emit(value);
    this.modalSS.$modalMedicine.emit(false);
  }
}
