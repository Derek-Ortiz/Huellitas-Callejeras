import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Citas } from './citas/citas';
import { CitasEdit } from './citas-edit/citas-edit';
import { Calendario } from './calendario/calendario';
import { CitasMain } from './pages/citas-main/citas-main';

const routes: Routes = [
    {
    path: '',
    component: CitasMain,
    children: [
      { path: '', component: Calendario }, 
      { path: 'citas-edit', component: CitasEdit }, 
      { path: 'citas-edit/:id', component: CitasEdit }, 
      { path: 'citas/:id', component: Citas }, 
      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitasRoutingModule { }
