import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tratamiento } from './tratamiento/tratamiento';
import { Medicine } from './medicine/medicine';
import { ModalMedicine } from './modal-medicine/modal-medicine';
import { AddTreatment } from './add-treatment/add-treatment';

const routes: Routes = [
  {
    path: '',
    component: Medicine,  // Componente por defecto cuando entras a /medicine
    children: [
      {
        path: 'modal-medicine',
        component: ModalMedicine
      }
    ]
  },
  {
    path: 'tratamiento',
    component: AddTreatment,  // Ruta /medicine/tratamiento
    children: [
      {
        path: 'add-treatment',
        component: AddTreatment  // Ruta /medicine/tratamiento/add-treatment
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleTratamientoRoutingModule { }
