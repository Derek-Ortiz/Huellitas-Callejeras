import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleTratamientoRoutingModule } from './module-tratamiento-routing-module';
import { Medicine } from './medicine/medicine';
import { Tratamiento } from './tratamiento/tratamiento';
import { ModalMedicine } from './modal-medicine/modal-medicine';
import { ModalTreatment } from './modal-treatment/modal-treatment';
import { AddTreatment } from './add-treatment/add-treatment';
import { RouterLink } from '@angular/router';
import { App } from '../../app';
import { AppRoutingModule } from '../../app-routing-module';


@NgModule({
  declarations: [
    Medicine,
    Tratamiento,
    ModalMedicine,
    ModalTreatment,
    AddTreatment
  ],
  imports: [
    CommonModule,
    ModuleTratamientoRoutingModule,
    RouterLink,
  ]
})
export class ModuleTratamientoModule { }
