import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ConexionApiLogin, RescatistaLogin } from './conexion-api-login';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private idrescatistaKey = 'id_rescatista';

  constructor(private api: ConexionApiLogin) {}

  createRescatista(nombre: string, contrasena: string): Observable<any> {
    return this.api.createRescatista(nombre, contrasena).pipe(
      catchError(err => {
        console.error('Error createRescatista:', err);
        return throwError(() => err);
      })
    );
  }

  
login(nombre: string, contrasena: string): Observable<{ id: string, token: string } | null> {
    console.log("nombre: ", nombre);
    console.log("password: ", contrasena);
    const payload: RescatistaLogin = { nombre, contrasena };

    return this.api.login(payload).pipe(
      map((res: any) => {
        console.log('Respuesta completa del servidor:', res);
        
        if (!res) {
          console.log('Respuesta vacía o null');
          return null;
        }

        const token =
          res.token
        
        console.log('Token extraído:', token);
        
        const rescatistaId = res.rescatista?.id;
        console.log('ID rescatista extraído:', rescatistaId);

      
        if (token && rescatistaId !== undefined) {
          console.log('Login exitoso - token e ID encontrados');
          return { id: rescatistaId, token: token };
        }

        console.log('Faltan token o ID en la respuesta');
        return null;
      }),
      tap(result => {
        
        if (result && result.token) {
          try {
          
            localStorage.setItem(this.tokenKey, result.token);
            localStorage.setItem(this.idrescatistaKey, result.id.toString());
            console.log("Guardado en localStorage idrescatista: ", result.id);
            
          } catch (e) {
            console.warn('No se pudo guardar token en localStorage', e);
          }
        }
      }),
      catchError(err => {
        console.error('Error en login:', err);
        return throwError(() => err);
      })
    );
}


  logout(): void {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch (e) {
      console.warn('No se pudo eliminar token de localStorage', e);
    }
  }

  isLoggedIn(): boolean {
    try {
      return !!localStorage.getItem(this.tokenKey);
    } catch (e) {
      return false;
    }
  }
}
