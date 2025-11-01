import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Navegation } from './navegation/navegation';
import { Medicine } from './medicine/medicine';

const routes: Routes = [
  {
    path: '',
    component: Navegation,
    title: 'Huellitas Callejeras'
  },
  {
    path: 'medicine',
    component: Medicine,
    title: 'Medicine'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
