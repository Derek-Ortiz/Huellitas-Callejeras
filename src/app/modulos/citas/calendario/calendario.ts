import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CitasService } from '../../citas/services/citaService';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit, OnDestroy {
  @ViewChild('fullCalendar') fullCalendar: any; // Referencia al calendario

  calendarOptions: CalendarOptions;
  private citasSubscription?: Subscription;
  private routerSubscription?: Subscription;
  mostrarCalendario = true;
  calendarApi: any;

  constructor(
    private router: Router, 
     public citasService: CitasService
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
      events: [],
      timeZone: 'UTC',
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      datesSet: this.onDatesSet.bind(this)
    };
  }

  ngOnInit(): void {
    console.log('🔄 Calendario Component - Inicializando...');

    this.citasService.cargarCitas();
    
    this.citasSubscription = this.citasService.citas$.subscribe(citas => {
      console.log('📅 Calendario - Citas recibidas:', citas.length);
      
      const eventos: EventInput[] = citas.map(c => {
        const fechaEvento = this.formatDateForCalendar(c.fechaCita);
        
        console.log(`📅 Mapeando cita: ${c.titulo} - Fecha: ${c.fechaCita} -> ${fechaEvento}`);
        
        return {
          id: c.id, 
          title: c.titulo,
          date: fechaEvento,
          color: this.getColorForEvent(c),
          extendedProps: { 
            id: c.id!,
            motivo: c.motivo,
            lugar: c.lugar,
            animalitoId: c.animalitoId
          }
        };
      });
      
      console.log('🎯 Eventos generados para calendario:', eventos);
      
      this.updateCalendarEvents(eventos);
    });

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.mostrarCalendario = event.url === '/citas';
      });
    
    this.mostrarCalendario = this.router.url === '/citas';
  }

  private updateCalendarEvents(eventos: EventInput[]): void {
    if (this.calendarApi) {
      console.log('🔄 Actualizando eventos del calendario...');
      
      this.calendarApi.removeAllEvents();
    
      if (eventos.length > 0) {
        this.calendarApi.addEventSource(eventos);
        console.log('✅ Eventos agregados al calendario');
      }
      
      this.calendarApi.render();
    } else {
      console.log('⏳ Calendar API no disponible aún, configurando eventos iniciales...');
      this.calendarOptions.events = eventos;
    }
  }

  onDatesSet(dateInfo: any): void {
    if (dateInfo.view && dateInfo.view.calendar) {
      this.calendarApi = dateInfo.view.calendar;
      console.log('📅 Calendar API obtenida');
    }
  }

  onCalendarReady(calendarApi: any): void {
    this.calendarApi = calendarApi;
    console.log('📅 Calendar listo - API obtenida');
  }

  private formatDateForCalendar(fechaUTC: string): string {
    if (!fechaUTC) return '';
    
    try {
      const fecha = new Date(fechaUTC);
      
      if (isNaN(fecha.getTime())) {
        console.warn('⚠ Fecha inválida:', fechaUTC);
        return '';
      }
      
      return fecha.toISOString().split('.')[0] + 'Z';
      
    } catch (error) {
      console.error('❌ Error formateando fecha:', fechaUTC, error);
      return '';
    }
  }

  private getColorForEvent(cita: any): string {
    const colores = [
      '#cc75c4ff', 
      '#4CAF50',   
      '#2196F3',   
      '#FF9800',   
      '#9C27B0',   
      '#F44336'    
    ];
    
    const hash = cita.titulo.length + cita.motivo.length;
    return colores[hash % colores.length];
  }

  onDateClick(info: any): void {
    if (this.mostrarCalendario) {
      console.log('📅 Fecha clickeada:', info.dateStr);
      const fechaSeleccionada = info.dateStr + 'T00:00:00';
      this.citasService.setFechaSeleccionada(fechaSeleccionada);
      this.router.navigate(['citas/citas-edit']);
    }
  }

  onEventClick(info: any): void {
    if (this.mostrarCalendario) {
      const id = info.event.extendedProps.id;
      console.log('🎯 Evento clickeado - ID:', id);
      this.router.navigate(['citas/citas', id]);
    }
  }

  ngOnDestroy(): void {
    this.citasSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }
}