
import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Paciente } from '../../../../core/interfaces/paciente.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expediente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expediente-form.html',
  styleUrls: ['./expediente-form.css']
})
export class ExpedienteForm implements OnChanges {
  @Output() save = new EventEmitter<any>();
  @Input() disabled = true; // controlado desde ExpedienteEdit
  @Input() initial: Paciente | null = null;

  model: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initial']) {
      this.model = this.initial ? { ...this.initial } : {};
    }
  }

  onSubmit() {
    this.save.emit(this.model);
  }
}
