import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitasRoutingModule } from './citas-routing-module';
import { CitasMain } from './pages/citas-main/citas-main';


@NgModule({
  declarations: [
    CitasMain
  ],
  imports: [
    CommonModule,
    CitasRoutingModule
  ]
})
export class CitasModule { }
