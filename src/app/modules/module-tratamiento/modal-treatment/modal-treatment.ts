import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreatmentModal } from '../services/treatment-modal';

@Component({
  selector: 'app-modal-treatment',
  standalone: false,
  templateUrl: './modal-treatment.html',
  styleUrl: './modal-treatment.css',
})
export class ModalTreatment {
  form: FormGroup;
  submitted = false;
  @Output() saved = new EventEmitter<{ medicamento: string; fecha: string; dosis: string; repeticion: string }>();

  constructor(private modalSS: TreatmentModal, private fb: FormBuilder ) {
    this.form = this.fb.group({
      medicamento: ['', Validators.required],
      fecha: ['', Validators.required],
      dosis: ['', Validators.required],
      repeticion: ['', Validators.required],
    });
  }
    
  ngOnInit() {}
  
  closeModalTreatmentEdit() { this.modalSS.$modalTreatment.emit(false); }

  submit(){
    this.submitted = true;
    if(this.form.invalid){ return; }
    this.saved.emit(this.form.value);
    this.modalSS.$modalTreatment.emit(false);
  }
}
