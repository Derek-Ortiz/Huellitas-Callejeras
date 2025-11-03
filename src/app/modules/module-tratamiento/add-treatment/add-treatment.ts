import { Component } from '@angular/core';
import { TreatmentModal } from '../services/treatment-modal';

@Component({
  selector: 'app-add-treatment',
  standalone: false,
  templateUrl: './add-treatment.html',
  styleUrl: './add-treatment.css',
})
export class AddTreatment {
  modalTreatmentEditOpen: boolean = false;
  nums: number[] = [1, 2, 3, 4, 5];
  constructor(private modalSS: TreatmentModal) { }
  ngOnInit() {
    this.modalSS.$modalTreatment.subscribe((valor) => {
      this.modalTreatmentEditOpen = valor;
    });
  }
  OpenModalTreatmentEdit1() {
      this.modalTreatmentEditOpen = !this.modalTreatmentEditOpen; 
    }

}
