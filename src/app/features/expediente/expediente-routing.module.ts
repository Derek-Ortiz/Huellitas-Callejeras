import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpedienteEdit } from './expediente-edit/expediente-edit/expediente-edit';

const routes: Routes = [

  { path: '', component: ExpedienteEdit },
  { path: 'editar', component: ExpedienteEdit }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedienteRoutingModule {}

