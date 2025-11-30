import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Animal, RescateResponse } from '../../interfaces/paciente.interface';

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
  @Input() initial: any = null; 

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
      if (this.initial) {
        this.model = { ...this.initial };
        if (!this.model.fechaIngreso) {
          this.model.fechaIngreso = this.formatDate(new Date());
        }
      } else {
        this.model = { fechaIngreso: this.formatDate(new Date()) };
      }
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getMissingFieldKeys(): string[] {
    const requiredKeys = [
      'nombre',
      'especie',
      'raza',
      'edad',
      'sexo',
      'peso',
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
    if (!this.model) {
      this.model = {};
    }
    this.model[key] = value;
    
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

  
  if (this.model) {
    const processedModel = { ...this.model }; 
   
    if (processedModel.peso !== undefined && processedModel.peso !== null) {
      processedModel.peso = Number(processedModel.peso);
    }
    if (processedModel.edad !== undefined && processedModel.edad !== null) {
      processedModel.edad = Number(processedModel.edad);
    }
    
    this.save.emit(processedModel);
  } else {
    this.save.emit(this.model);
  }
}

  onCancel() {
    this.cancel.emit();
  }
}