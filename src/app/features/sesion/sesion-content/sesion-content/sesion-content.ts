import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sesion-content',
  standalone: false,
  templateUrl: './sesion-content.html',
  styleUrls: ['./sesion-content.css']
})
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
    // El AuthService.login ahora devuelve Observable<{ id: number, token: string } | null>
    this.auth.login(this.nombre, this.password).subscribe({

      next: result => {
        // 🎯 MODIFICACIÓN CLAVE:
        // Navegará SOLO si result no es null (es decir, si contiene el ID Y el Token).
        if (result) { // result es { id: number, token: string }
          this.router.navigate(['/expediente/editar']);
        } else { // result es null (token o id no se encontraron/fueron incorrectos)
          this.invalid = true;
        }
      },
      error: err => {
        console.warn('Error en login:', err);
        this.invalid = true; // Manejo de error de la API (ej: error 401, 500, etc.)
      }
    });
}

  onPasswordChange() {
    if (this.invalid) this.invalid = false;
  }
}
