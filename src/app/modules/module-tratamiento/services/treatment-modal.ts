import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TreatmentModal {
  
  constructor() { }
  $modalTreatment = new EventEmitter<any>();
}
