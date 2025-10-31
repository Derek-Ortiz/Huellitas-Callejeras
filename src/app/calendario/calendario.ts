import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { CitasService } from '../services/citaService';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario {
  calendarOptions: CalendarOptions;

  constructor(private router: Router, private citasService: CitasService) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      editable: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      dateClick: this.onDateClick.bind(this),
      eventClick: this.onEventClick.bind(this),
      events: []
    };

    
    this.citasService.citas$.subscribe(citas => {
      this.calendarOptions.events = citas.map(c => ({
        title: c.titulo,
        date: c.fecha,
        color: '#cc75c4ff',
        extendedProps: { id: c.id }
      }));
    });
  }

  onDateClick(info: any) {
    this.citasService.setFechaSeleccionada(info.dateStr);
    this.router.navigate(['/citas-edit']);
  }

   onEventClick(info: any) {
    const id = info.event.extendedProps.id;
    this.citasService.setCitaSeleccionada(id);
    this.router.navigate(['/citas']);
  }
}
