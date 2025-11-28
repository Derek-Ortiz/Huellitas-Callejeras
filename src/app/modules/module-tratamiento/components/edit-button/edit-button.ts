import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-button',
  standalone: false,
  templateUrl: './edit-button.html',
  styleUrl: './edit-button.css',
})
export class EditButtonComponent {
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
