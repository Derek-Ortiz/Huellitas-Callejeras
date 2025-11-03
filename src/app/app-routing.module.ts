import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'expediente', pathMatch: 'full' },
  { path: 'expediente', loadChildren: () => import('./features/expediente/expediente.module').then(m => m.ExpedienteModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
