import { Component } from '@angular/core';
import { MedicineModalSwitch } from '../services/medicine-modal';


@Component({
  selector: 'app-modal-medicine',
  standalone: false,
  templateUrl: './modal-medicine.html',
  styleUrl: './modal-medicine.css',
})
export class ModalMedicine {

  
  constructor(private modalSS: MedicineModalSwitch ) { }

  ngOnInit() {


  }

  closeModalMedicineEdit() {
    this.modalSS.$modalMedicine.emit(false);
  } 
}
