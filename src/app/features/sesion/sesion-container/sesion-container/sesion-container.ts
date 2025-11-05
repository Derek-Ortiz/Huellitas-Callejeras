import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionContent } from '../../sesion-content/sesion-content/sesion-content';

@Component({
  selector: 'app-sesion-container',
  standalone: true,
  imports: [CommonModule, SesionContent],
  templateUrl: './sesion-container.html',
  styleUrls: ['./sesion-container.css']
})
export class SesionContainer {}
