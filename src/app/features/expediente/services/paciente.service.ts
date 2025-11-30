import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Paciente } from '../interfaces/paciente.interface';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private mock: Paciente[] = [];
  private _current?: Paciente;

  constructor() {}

  private deepClone<T>(value: T): T {
    if (value === undefined || value === null) return value;
    const sc = (globalThis as any).structuredClone;
    if (typeof sc === 'function') {
      try {
        return sc(value);
      } catch (_e) {
      }
    }
    return JSON.parse(JSON.stringify(value));
  }

  list(): Observable<Paciente[]> {
    return of(this.mock.map(m => this.deepClone(m)));
  }

  get(id: number): Observable<Paciente | undefined> {
    const found = this.mock.find(p => Number(p.id) === Number(id));
    return of(found ? this.deepClone(found) : undefined);
  }

  setCurrent(p?: Paciente) {
    this._current = p ? this.deepClone(p) : undefined;
  }

  getCurrent(): Paciente | undefined {
    return this._current ? this.deepClone(this._current) : undefined;
  }

  save(p: Paciente): Observable<Paciente> {
    if (!p || !p.nombre || String(p.nombre).trim() === '') {
      return throwError(() => new Error('El campo "nombre" es obligatorio'));
    }

    const payload = this.deepClone(p) as Paciente;

    if (payload.id != null) {
      const asNum = Number(payload.id);
      if (Number.isNaN(asNum)) return throwError(() => new Error('ID inválido'));
      payload.id = asNum;
    }

    if (payload.id == null) {
      const nextId = this.mock.length ? Math.max(...this.mock.map(m => Number(m.id ?? 0))) + 1 : 1;
      payload.id = nextId;
      this.mock.push(payload);
    } else {
      const idx = this.mock.findIndex(m => Number(m.id) === Number(payload.id));
      if (idx >= 0) {
        this.mock[idx] = { ...this.mock[idx], ...payload };
      } else {
        this.mock.push(payload);
      }
    }

    return of(this.deepClone(payload));
  }

  delete(id: number): Observable<boolean> {
    const idx = this.mock.findIndex(m => Number(m.id) === Number(id));
    if (idx >= 0) {
      this.mock.splice(idx, 1);
      return of(true);
    }
    return of(false);
  }
}
