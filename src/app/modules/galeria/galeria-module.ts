import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { TarjetaExpedienteComponent } from './components/tarjeta-expediente/tarjeta-expediente.component';
import { GaleriaRoutingModule } from './galeria-routing-module';

@NgModule({
  declarations: [
    GaleriaComponent,
    TarjetaExpedienteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GaleriaRoutingModule
  ]
})
export class GaleriaModule { }