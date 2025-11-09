import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CitasService } from '../../citas/services/citaService';
import { CalendarEvent } from '../interfaces/calendarEventI';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit, OnDestroy {
  calendarOptions: CalendarOptions;
  private citasSubscription?: Subscription;
  private routerSubscription?: Subscription;
  mostrarCalendario = true;

  constructor(
    private router: Router, 
    private citasService: CitasService
  ) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      editable: true,
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      buttonText: {
        today: 'Hoy'
      },
      dateClick: this.onDateClick.bind(this),
      eventClick: this.onEventClick.bind(this),
      events: []
    };
  }

  ngOnInit(): void {
    
    this.citasSubscription = this.citasService.citas$.subscribe(citas => {
      const eventos: CalendarEvent[] = citas.map(c => ({
        title: c.titulo,
        date: c.fecha,
        color: '#cc75c4ff',
        extendedProps: { id: c.id! }
      }));
      
      this.calendarOptions.events = eventos;
    });

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.mostrarCalendario = event.url === '/citas';
      });
    
    
    this.mostrarCalendario = this.router.url === '/citas';
  }

  ngOnDestroy(): void {
    this.citasSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  onDateClick(info: any): void {
       if (this.mostrarCalendario) {
      this.citasService.setFechaSeleccionada(info.dateStr);
      const fecha = info.dateStr.replace('T', ' ');
      this.citasService.setFechaSeleccionada(fecha + 'T00:00'); 
      this.router.navigate(['citas/citas-edit']);
    }
  }

  onEventClick(info: any): void {
    
    if (this.mostrarCalendario) {
      const id = info.event.extendedProps.id;
      this.router.navigate(['citas/citas', id]);
    }
  }
}