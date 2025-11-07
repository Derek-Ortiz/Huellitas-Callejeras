import { Component } from '@angular/core';
import { TreatmentModal } from '../services/treatment-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tratamiento',
  standalone: false,
  templateUrl: './tratamiento.html',
  styleUrl: './tratamiento.css',
})
export class Tratamiento {
  modalTreatmentEditOpen: boolean = false;
  nums: number[] = [1, 2, 3, 4];
  constructor(private modalSS: TreatmentModal) { }
  ngOnInit() {
    this.modalSS.$modalTreatment.subscribe((valor) => {
      this.modalTreatmentEditOpen = valor;
    });

   

  }
   OpenModalTreatmentEdit() {
      this.modalTreatmentEditOpen = !this.modalTreatmentEditOpen; 
    }

}
