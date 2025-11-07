import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-status-buttons',
  standalone: false,
  templateUrl: './status-buttons.html',
  styleUrls: ['./status-buttons.css']
})
export class StatusButtonsComponent {
  @Input() estado: 'No adoptado' | 'Adoptado' | 'En tratamiento' = 'No adoptado';
  @Output() estadoChange = new EventEmitter<'No adoptado' | 'Adoptado' | 'En tratamiento'>();
  @Output() tratamientos = new EventEmitter<void>();

  estados = [
    { texto: 'No adoptado', clase: 'status-noadoptado' },
    { texto: 'Adoptado', clase: 'status-adoptado' },
    { texto: 'En tratamiento', clase: 'status-tratamiento' }
  ];

  indiceFromEstado(): number {
    const idx = this.estados.findIndex(e => e.texto === this.estado);
    return idx >= 0 ? idx : 0;
  }

  cambiarEstado() {
    const idx = (this.indiceFromEstado() + 1) % this.estados.length;
    const nuevo = this.estados[idx].texto as 'No adoptado' | 'Adoptado' | 'En tratamiento';
    this.estado = nuevo;
    this.estadoChange.emit(nuevo);
  }

  triggerTratamientos() {
    
    this.tratamientos.emit();
  }
}
