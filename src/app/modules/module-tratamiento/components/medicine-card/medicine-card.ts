import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-medicine-card',
  standalone: false,
  templateUrl: './medicine-card.html',
  styleUrl: './medicine-card.css',
})
export class MedicineCardComponent {
  @Input() name = 'Paracetamol';
  @Input() completionDate = '';
  @Input() dose = '';
  @Input() repetition = '';

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
