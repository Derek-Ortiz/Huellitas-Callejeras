import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-back-button',
  standalone: false,
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButtonComponent {
  @Output() clickBack = new EventEmitter<void>();
  onClick(){ this.clickBack.emit(); }
}
