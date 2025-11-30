import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-desicion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-desicion.html',
  styleUrls: ['./modal-desicion.css']
})
export class ModalDesicion {
  @Input() message: string = '';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
  }

  decline() {
    this.cancelled.emit();
  }
}
