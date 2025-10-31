import { Component, OnInit } from '@angular/core';
import { CitasService } from '../services/citaService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-citas',
  standalone: false,
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class Citas implements OnInit {
  citaSeleccionada: any = null;

  constructor(private citasService: CitasService, private router: Router) {}

  ngOnInit() {
    this.citasService.citaSeleccionada$.subscribe(cita => {
      this.citaSeleccionada = cita;
    });
  }

  volverAlCalendario() {
    this.router.navigate(['/calendario']);
  }
}
