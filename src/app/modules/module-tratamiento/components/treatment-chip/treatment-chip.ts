import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-treatment-chip',
  standalone: false,
  templateUrl: './treatment-chip.html',
  styleUrl: './treatment-chip.css',
})
export class TreatmentChipComponent {
  @Input() label = 'Tratamiento 1';
  @Output() delete = new EventEmitter<void>();
  @Output() click = new EventEmitter<void>();

  onDelete(){ this.delete.emit(); }
  onClick(){ this.click.emit(); }
}
