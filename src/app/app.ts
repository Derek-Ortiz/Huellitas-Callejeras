import { Component } from '@angular/core';
import { Expediente } from './galeria/interfaces/expediente.interface';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <app-header
      (clickInicio)="onClickInicio()"
      (clickCalendario)="onClickCalendario()"
      (clickAgregar)="onClickAgregarHeader()">
    </app-header>
    
    <app-galeria
      (clickVolver)="onClickVolver()"
      (clickAgregar)="onClickAgregarGaleria()"
      (clickExpediente)="onClickExpediente($event)">
    </app-galeria>
  `,
  styles: []
})
export class App {
  
  onClickInicio(): void {
    console.log('Clic en Inicio');
  }

  onClickCalendario(): void {
    console.log('Clic en Calendario');
  }

  onClickAgregarHeader(): void {
    console.log('Clic en Agregar (desde header)');
  }

  onClickVolver(): void {
    console.log('Clic en Volver');
  }

  onClickAgregarGaleria(): void {
    console.log('Clic en Agregar (desde galería)');
  }

  onClickExpediente(expediente: Expediente): void {
    console.log('Expediente seleccionado:', expediente);
  }
}
