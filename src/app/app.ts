
import { Component, signal, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App {
  protected readonly title = signal('Huellitas-Callejeras');
  protected readonly mostrarNavegacion = signal(false);
  
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('🔍 Ruta actual:', event.url);
        
        const rutasConNavegacion = ['/expediente', '/citas', '/galeria'];
        const mostrar = rutasConNavegacion.some(ruta => 
          event.url.includes(ruta)
        );
        
        console.log('👁️ Mostrar navegación?', mostrar);
        this.mostrarNavegacion.set(mostrar);
      });
  }
}