import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Calendario } from './calendario/calendario';
import { CitasEdit } from './citas-edit/citas-edit';
import { Citas } from './citas/citas';

const routes: Routes = [
    { path: '', component: Citas },
  { path: 'citas-edit', component: CitasEdit },
  { path: 'calendario', component: Calendario },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
