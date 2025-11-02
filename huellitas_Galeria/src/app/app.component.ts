import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { GaleriaComponent } from './components/galeria/galeria.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, GaleriaComponent],
  template: `
    <app-header></app-header>
    <app-galeria></app-galeria>
  `,
  styles: []
})
export class AppComponent {
  title = 'huellitas-callejeras';
}