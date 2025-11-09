import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Navegation } from './navegation/navegation';


const routes: Routes = [
  {
    path: '',
    component: Navegation,
    title: 'Huellitas Callejeras'
  },
  {
    path: 'medicine',
    loadChildren: () => import('./modules/module-tratamiento/module-tratamiento-module').then(m => m.ModuleTratamientoModule),
    title: 'Medicine'
  },
  {
     path: 'citas',
    loadChildren: () => import('./modules/citas/citas-module').then(m => m.CitasModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
