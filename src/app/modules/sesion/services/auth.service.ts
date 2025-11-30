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

  /**
   * Crea un rescatista usando el servicio de conexión. Devuelve el Observable
   * que emite la respuesta del backend.
   */
  createRescatista(nombre: string, contrasena: string): Observable<any> {
    return this.api.createRescatista(nombre, contrasena).pipe(
      catchError(err => {
        console.error('Error createRescatista:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Intenta autenticarse con el backend. Si recibe un token lo guarda en
   * localStorage bajo la clave `auth_token`.
   * Devuelve un Observable<string|null> con el token (o null si no viene).
   */
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

        // 1. Intentar extraer el token
        const token =
          res.token ??
          res.auth_token ??
          (res.data && (res.data.token ?? res.data.auth_token)) ??
          res.accessToken ??
          res.access_token ??
          null;
        
        console.log('Token extraído:', token);
        
        // 2. Intentar extraer el ID del rescatista
        const rescatistaId = res.rescatista?.id;
        console.log('ID rescatista extraído:', rescatistaId);

        // Verificar si ambos existen
        if (token && rescatistaId !== undefined) {
          console.log('Login exitoso - token e ID encontrados');
          return { id: rescatistaId, token: token };
        }

        console.log('Faltan token o ID en la respuesta');
        return null;
      }),
      tap(result => {
        // `result` ahora es el objeto { id, token } o null
        // El guardado en localStorage solo ocurre si `result` es un objeto válido.
        if (result && result.token) {
          try {
            // Guardar token y el id del rescatista
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
