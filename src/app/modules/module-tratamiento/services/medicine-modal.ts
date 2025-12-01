import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MedicineModalSwitch {
  
  constructor() { }

  $modalMedicine = new EventEmitter<any>();

  open(initial: any = null) {
    this.$modalMedicine.emit(true);
  }

  close() {
    this.$modalMedicine.emit(false);
  }


}
