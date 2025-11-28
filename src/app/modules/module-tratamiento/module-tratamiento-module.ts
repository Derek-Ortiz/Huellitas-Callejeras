import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModuleTratamientoRoutingModule } from './module-tratamiento-routing-module';
import { Medicine } from './medicine/medicine';
import { Tratamiento } from './tratamiento/tratamiento';
import { ModalMedicine } from './modal-medicine/modal-medicine';
import { ModalTreatment } from './modal-treatment/modal-treatment';
import { AddTreatment } from './add-treatment/add-treatment';
import { RouterLink } from '@angular/router';
import { App } from '../../app';
import { AppRoutingModule } from '../../app-routing-module';
import { EditButtonComponent } from './components/edit-button/edit-button';
import { MedicineCardComponent } from './components/medicine-card/medicine-card';
import { TreatmentChipComponent } from './components/treatment-chip/treatment-chip';
import { BackButtonComponent } from './components/back-button/back-button';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog';


@NgModule({
  declarations: [
    Medicine,
    Tratamiento,
    ModalMedicine,
    ModalTreatment,
    AddTreatment,
    EditButtonComponent,
    MedicineCardComponent,
    TreatmentChipComponent,
    BackButtonComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ModuleTratamientoRoutingModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ModuleTratamientoModule { }
