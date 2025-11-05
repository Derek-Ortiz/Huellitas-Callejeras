import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sesion-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sesion-content.html',
  styleUrls: ['./sesion-content.css']
})
export class SesionContent {}
