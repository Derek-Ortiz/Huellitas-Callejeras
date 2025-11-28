import { Injectable } from '@angular/core';

export interface TreatmentItem {
  id: number;
  name: string;
  startDate: string;
  prescriptionFile?: string;
  medicines: Array<{ name: string; date: string; dose: string; repetition: string }>;
}

@Injectable({ providedIn: 'root' })
export class TreatmentStore {
  private items: TreatmentItem[] = [
    { id: 1, name: 'Tratamiento 1', startDate: '20-11-2025', medicines: [] },
    { id: 2, name: 'Tratamiento 2', startDate: '', medicines: [] },
    { id: 3, name: 'Tratamiento 3', startDate: '', medicines: [] },
    { id: 4, name: 'Tratamiento 4', startDate: '', medicines: [] },
  ];

  getAll(): TreatmentItem[] { return [...this.items]; }
  addTop(item: Omit<TreatmentItem, 'id'>): TreatmentItem {
    const id = Math.max(0, ...this.items.map(i=>i.id)) + 1;
    const newItem: TreatmentItem = { id, ...item };
    this.items = [newItem, ...this.items];
    return newItem;
  }
}
