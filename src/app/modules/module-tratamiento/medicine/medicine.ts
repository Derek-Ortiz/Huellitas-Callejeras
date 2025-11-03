import { Component } from '@angular/core';
import { MedicineModalSwitch } from '../services/medicine-modal';

@Component({
  selector: 'app-medicine',
  standalone: false,
  templateUrl: './medicine.html',
  styleUrl: './medicine.css',
})
export class Medicine {
  num: number = 0;
  nums: number[] = [1, 2, 3, 4];

  modalMedicineEditOpen: boolean = false;

  constructor(private modalSS: MedicineModalSwitch) { }


  ngOnInit() {
    this.modalSS.$modalMedicine.subscribe((valor) => {
      this.modalMedicineEditOpen = valor;
    });

  }

  OpenModalMedicineEdit() {
    this.modalMedicineEditOpen = !this.modalMedicineEditOpen;
  }
}
