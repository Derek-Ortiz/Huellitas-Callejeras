import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MedicineModalSwitch {
  
  constructor() { }

  $modalMedicine = new EventEmitter<any>();


}
