<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
>>>>>>> Expediente

@Component({
  selector: 'app-sesion-content',
  standalone: false,
  templateUrl: './sesion-content.html',
  styleUrls: ['./sesion-content.css']
})
<<<<<<< HEAD
export class SesionContent {}
=======
export class SesionContent implements OnInit {
  password = '';
  invalid = false;

  nombre = 'Yadira Lizbeth Castro Velasco';

  constructor(private auth: AuthService, private router: Router) {
    console.log('[SesionContent] constructor');
  }

  ngOnInit(): void {
    console.log('[SesionContent] ngOnInit - componente inicializado');
  }

login() {
    console.log('[SesionContent] login invoked, nombre=', this.nombre);
    console.log('[SesionContent] password=', this.password);
    
    this.auth.login(this.nombre, this.password).subscribe({
      next: result => {
        console.log('[SesionContent] Resultado del login:', result);
        
        if (result) {
          console.log('[SesionContent] Navegando a /expediente/editar');
          this.router.navigate(['/expediente/view']).then(success => {
            console.log('[SesionContent] Navegación exitosa:', success);
          }).catch(error => {
            console.error('[SesionContent] Error en navegación:', error);
          });
        } else {
          console.log('[SesionContent] Login fallido - resultado null');
          this.invalid = true;
        }
      },
      error: err => {
        console.error('[SesionContent] Error en login:', err);
        this.invalid = true;
      }
    });
}

  onPasswordChange() {
    if (this.invalid) this.invalid = false;
  }
}
>>>>>>> Expediente
