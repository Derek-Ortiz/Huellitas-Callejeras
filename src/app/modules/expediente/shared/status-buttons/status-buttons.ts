import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-status-buttons',
  standalone: false,
  templateUrl: './status-buttons.html',
  styleUrls: ['./status-buttons.css']
})
export class StatusButtonsComponent {
  @Input() estado: 'En adopción' | 'Adoptado' | 'En recuperación' = 'En adopción';
  @Output() estadoChange = new EventEmitter<'En adopción' | 'Adoptado' | 'En recuperación'>();
  @Output() tratamientos = new EventEmitter<void>();

  estados = [
    { texto: 'En adopción', clase: 'status-noadoptado' },
    { texto: 'Adoptado', clase: 'status-adoptado' },
    { texto: 'En recuperación', clase: 'status-tratamiento' }
  ];

  indiceFromEstado(): number {
    const idx = this.estados.findIndex(e => e.texto === this.estado);
    return idx >= 0 ? idx : 0;
  }

  cambiarEstado() {
    const idx = (this.indiceFromEstado() + 1) % this.estados.length;
    const nuevo = this.estados[idx].texto as 'En adopción' | 'Adoptado' | 'En recuperación';
    this.estado = nuevo;
    this.estadoChange.emit(nuevo);
  }

  triggerTratamientos() {
    
    this.tratamientos.emit();
  }
}
