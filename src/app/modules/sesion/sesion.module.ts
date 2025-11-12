import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionRoutingModule } from './sesion-routing.module';
import { SesionContainer } from './sesion-container/sesion-container/sesion-container';
import { SesionContent } from './sesion-content/sesion-content/sesion-content';

@NgModule({
  imports: [CommonModule, SesionRoutingModule],
  declarations: [SesionContainer, SesionContent],
  exports: [SesionContainer, SesionContent]
})
export class SesionModule {}
