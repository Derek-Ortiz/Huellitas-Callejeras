import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitasRoutingModule } from './citas-routing-module';
import { CitasMain } from './pages/citas-main/citas-main';
import { Calendario } from './calendario/calendario';
import { CitasEdit } from './citas-edit/citas-edit';
import { Citas } from './citas/citas';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';


@NgModule({
  declarations: [
    CitasMain,
    Citas,
    CitasEdit,
    Calendario
  ],
  imports: [
    CommonModule,
    CitasRoutingModule,
    FormsModule,
    FullCalendarModule
  ]
})
export class CitasModule { }
