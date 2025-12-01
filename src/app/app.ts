
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
        const url = (event as NavigationEnd).urlAfterRedirects || event.url;
        console.log('🔍 Ruta actual:', url);

        // Ocultar navegación si estamos en la ruta raíz ("/") que carga sesión
        // o cualquier ruta que empiece con /sesion
        const esSesion = url === '/' || url === '' || url.startsWith('/sesion');
        const mostrar = !esSesion;

        console.log('👁️ Mostrar navegación?', mostrar);
        this.mostrarNavegacion.set(mostrar);
      });
  }
}