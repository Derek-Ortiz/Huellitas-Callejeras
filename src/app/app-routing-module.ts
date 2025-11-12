import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Navegation } from './navegation/navegation';


const routes: Routes = [
  { path: '',
    loadChildren: () => import('./modules/sesion/sesion.module').then(m => m.SesionModule),
    title: 'Home'
  },
  {
    path: 'expediente', loadChildren: () => import('./modules/expediente/expediente.module').then(m => m.ExpedienteModule) 
   },
  {
    path: 'medicine',
    loadChildren: () => import('./modules/module-tratamiento/module-tratamiento-module').then(m => m.ModuleTratamientoModule),
    title: 'Medicine'
  },
  {
     path: 'citas',
    loadChildren: () => import('./modules/citas/citas-module').then(m => m.CitasModule)
  },
  {
    path: 'galeria',
    loadChildren: () => import('./modules/galeria/galeria-module').then(m => m.GaleriaModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
