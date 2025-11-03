import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpedienteRoutingModule } from './expediente-routing.module';
import { ExpedienteEdit } from './expediente-edit/expediente-edit/expediente-edit';
import { ExpedienteForm } from './expediente-form/expediente-form/expediente-form';
import { SharedModule } from '../../shared/shared-module';
import { HeaderComponent } from '../../shared/header/header';
import { StatusButtonsComponent } from '../../shared/status-buttons/status-buttons';
import { ToastComponent } from '../../shared/toast/toast.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ExpedienteRoutingModule, SharedModule,
    ExpedienteEdit, ExpedienteForm, HeaderComponent, StatusButtonsComponent, ToastComponent
  ]
})
export class ExpedienteModule {}
