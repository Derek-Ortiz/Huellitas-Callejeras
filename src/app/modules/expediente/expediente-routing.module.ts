import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpedienteEdit } from './expediente-edit/expediente-edit/expediente-edit';
import { ExpedientesView } from './expedientes-view/expedientes-view/expedientes-view';

const routes: Routes = [
  { path: '', component: ExpedienteEdit },
  { path: 'editar', component: ExpedienteEdit },
  { path: 'editar/:id', component: ExpedienteEdit },
  { path: 'view', component: ExpedientesView }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedienteRoutingModule {}

