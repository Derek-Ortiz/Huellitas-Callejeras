
import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Paciente } from '../../interfaces/paciente.interface';

@Component({
  selector: 'app-expediente-form',
  standalone: false,
  templateUrl: './expediente-form.html',
  styleUrls: ['./expediente-form.css']
})
export class ExpedienteForm implements OnChanges {
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() disabled = true; 
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

  onCancel() {
  
    this.model = this.initial ? { ...this.initial } : {};
    this.cancel.emit();
  }
}
