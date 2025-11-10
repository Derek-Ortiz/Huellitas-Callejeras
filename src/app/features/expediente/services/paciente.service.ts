import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Paciente } from '../interfaces/paciente.interface';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private mock: Paciente[] = [];
  private _current?: Paciente;

  constructor() {}

  list(): Observable<Paciente[]> {
    return of(this.mock);
  }

  get(id: number): Observable<Paciente | undefined> {
    return of(this.mock.find(p => p.id === id));
  }

  setCurrent(p?: Paciente) {
    this._current = p;
  }

  getCurrent(): Paciente | undefined {
    return this._current;
  }

  save(p: Paciente): Observable<Paciente> {
    if (p.id == null) {
      p.id = (this.mock.length ? Math.max(...this.mock.map(m => m.id || 0)) + 1 : 1);
      this.mock.push(p);
    } else {
      const idx = this.mock.findIndex(m => m.id === p.id);
      if (idx >= 0) this.mock[idx] = p;
      else this.mock.push(p);
    }
    return of(p);
  }

  delete(id: number): Observable<boolean> {
    const idx = this.mock.findIndex(m => m.id === id);
    if (idx >= 0) {
      this.mock.splice(idx, 1);
      return of(true);
    }
    return of(false);
  }
}
