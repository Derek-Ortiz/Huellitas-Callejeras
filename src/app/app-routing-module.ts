import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
   {
    path: 'citas',
    loadChildren: () => import('./modulos/citas/citas-module').then(m => m.CitasModule)
  },
  { path: '', redirectTo: '/citas', pathMatch: 'full' },
  { path: '**', redirectTo: '/citas' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }