import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario {

  calendarOptions: any;

  constructor() {
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
      events: [
        { title: 'Examen de Redes', date: '2025-10-29', color: '#f44336' },
        { title: 'Entrega de Proyecto', date: '2025-10-30', color: '#4CAF50' },
      ]
    };
  }

 
  onDateClick(info: any) {
    const title = prompt('📅 Escribe el título del recordatorio:');
    if (title) {
      this.calendarOptions.events = [
        ...this.calendarOptions.events,
        { title, date: info.dateStr, color: '#cc75c4ff' }
      ];
    }
  }
}