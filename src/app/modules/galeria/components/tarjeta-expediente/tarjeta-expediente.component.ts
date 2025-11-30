import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Expediente } from '../../interfaces/expediente.interface';

@Component({
  selector: 'app-tarjeta-expediente',
  standalone: false,
  templateUrl: './tarjeta-expediente.component.html',
  styleUrls: ['./tarjeta-expediente.component.css']
})
export class TarjetaExpedienteComponent {
  @Input() expediente!: Expediente;
  @Output() clickTarjeta = new EventEmitter<Expediente>();
  @Output() eliminarExpediente = new EventEmitter<Expediente>();

  onClickTarjeta(): void {
    this.clickTarjeta.emit(this.expediente);
  }

  onEliminar(event: Event): void {
    event.stopPropagation();
    this.eliminarExpediente.emit(this.expediente);
  }
}