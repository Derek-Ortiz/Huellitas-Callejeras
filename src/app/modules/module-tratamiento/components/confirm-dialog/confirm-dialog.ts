import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: false,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialogComponent {
  @Input() message = '¿Deseas eliminar este tratamiento?';
  @Output() accept = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
