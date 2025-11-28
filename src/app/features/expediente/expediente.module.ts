import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpedienteRoutingModule } from './expediente-routing.module';
import { ExpedienteEdit } from './expediente-edit/expediente-edit/expediente-edit';
import { ExpedienteForm } from './expediente-form/expediente-form/expediente-form';
import { ExpedientesView } from './expedientes-view/expedientes-view/expedientes-view';
import { ModalDesicion } from './modal-desicion/modal-desicion';
import { SharedModule } from './shared/shared-module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ExpedienteRoutingModule, SharedModule, ModalDesicion],
  declarations: [ExpedienteEdit, ExpedienteForm, ExpedientesView],
  exports: [ExpedienteEdit, ExpedienteForm, ExpedientesView]
})
export class ExpedienteModule {}
