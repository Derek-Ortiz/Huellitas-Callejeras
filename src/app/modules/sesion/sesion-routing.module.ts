import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SesionContainer } from './sesion-container/sesion-container/sesion-container';

const routes: Routes = [
  { path: '', component: SesionContainer }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SesionRoutingModule {}
