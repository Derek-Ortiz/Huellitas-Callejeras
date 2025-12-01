import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GaleriaComponent } from './components/galeria/galeria.component';

const routes: Routes = [
    {
    path: '',
    component: GaleriaComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GaleriaRoutingModule { }
