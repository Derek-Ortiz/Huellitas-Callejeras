
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
  missingFields: Set<string> = new Set();

  get computedDisabled(): boolean {
    if (this.disabled) return true;
    const required = [
      'nombre',
      'especie',
      'raza',
      'edad',
      'sexo',
      'peso',
      'fechaIngreso',
      'lugar',
      'descripcion'
    ];

    for (const key of required) {
      const val = this.model ? this.model[key] : null;
      if (val === null || val === undefined) return true;
      if (typeof val === 'string' && val.trim() === '') return true;
    }

    return false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initial']) {
      this.model = this.initial ? { ...this.initial } : {};
    }
  }

  private getMissingFieldKeys(): string[] {
    const requiredKeys = [
      'nombre',
      'especie',
      'raza',
      'edad',
      'sexo',
      'peso',
      'fechaIngreso',
      'lugar',
      'descripcion'
    ];

    const missing: string[] = [];
    for (const key of requiredKeys) {
      const val = this.model ? this.model[key] : null;
      if (val === null || val === undefined) {
        missing.push(key);
        continue;
      }
      if (typeof val === 'string' && val.trim() === '') {
        missing.push(key);
      }
    }
    return missing;
  }

  public hasMissingRequired(): boolean {
    return this.getMissingFieldKeys().length > 0;
  }

  onFieldChange(key: string, value: any) {
    if (this.missingFields.has(key)) {
      const empty = value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
      if (!empty) {
        this.missingFields.delete(key);
      }
    }
  }

  onSubmit() {
    const missingKeys = this.getMissingFieldKeys();
    if (missingKeys.length > 0) {
      this.missingFields = new Set(missingKeys);
      return;
    }

    this.save.emit(this.model);
  }

  onCancel() {
    this.cancel.emit();
  }
}
