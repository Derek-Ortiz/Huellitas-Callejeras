import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SesionRoutingModule } from './sesion-routing.module';
import { SesionContainer } from './sesion-container/sesion-container/sesion-container';
import { SesionContent } from './sesion-content/sesion-content/sesion-content';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, SesionRoutingModule],
  declarations: [SesionContainer, SesionContent],
  exports: [SesionContainer, SesionContent]
})
export class SesionModule {}
