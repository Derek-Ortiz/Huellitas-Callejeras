import { Component } from '@angular/core';
import { TreatmentModal } from '../services/treatment-modal';

@Component({
  selector: 'app-modal-treatment',
  standalone: false,
  templateUrl: './modal-treatment.html',
  styleUrl: './modal-treatment.css',
})
export class ModalTreatment {

  constructor(private modalSS: TreatmentModal ) { }
  
    ngOnInit() {
  
  
    }
  
    closeModalTreatmentEdit() {
      this.modalSS.$modalTreatment.emit(false);
    } 
}
