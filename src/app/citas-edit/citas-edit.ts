import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CitasService } from '../services/citaService';

@Component({
  selector: 'app-citas-edit',
  standalone: false,
  templateUrl: './citas-edit.html',
  styleUrl: './citas-edit.css',
})
export class CitasEdit implements OnInit {
  cita = {
    titulo: '',
    fecha: '',
    lugar: '',
    motivo: '',
    fechaRealizacion: ''
  };

  constructor(private citasService: CitasService, private router: Router) {}

  ngOnInit() {
    this.citasService.fechaSeleccionada$.subscribe(fecha => {
      if (fecha) this.cita.fecha = fecha;
    });
  }

  guardar() {
    this.citasService.agregarCita(this.cita);
    this.cita = { titulo: '', fecha: '', lugar: '', motivo: '', fechaRealizacion: '' };
    this.router.navigate(['/']);
  }
}
