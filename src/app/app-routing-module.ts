import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

<<<<<<< HEAD

const routes: Routes = [
  {
    path: '',
    component: Navegation,
    title: 'Huellitas Callejeras'
  },
  {
    path: 'medicine',
    loadChildren: () => import('./modulos/module-tratamiento/module-tratamiento-module').then(m => m.ModuleTratamientoModule),
    title: 'Medicine'
  },
   {
    path: 'citas',
    loadChildren: () => import('./modulos/citas/citas-module').then(m => m.CitasModule)
  },
  { path: '', redirectTo: '/citas', pathMatch: 'full' },
  { path: '**', redirectTo: '/citas' }
];
=======
const routes: Routes = [];
>>>>>>> parent of db97356 (Merge branch 'Tratamiento' of https://github.com/Derek-Ortiz/Huellitas-Callejeras into Tratamientos)

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }