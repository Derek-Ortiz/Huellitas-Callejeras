import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expediente } from '../../interfaces/expediente.interface';

@Component({
    selector: 'app-tarjeta-expediente',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tarjeta-expediente.component.html',
    styleUrls: ['./tarjeta-expediente.component.css']
})
export class TarjetaExpedienteComponent {
    @Input() expediente!: Expediente;
    @Output() clickTarjeta = new EventEmitter<Expediente>();

    onClickTarjeta(): void {
        this.clickTarjeta.emit(this.expediente);
    }
}