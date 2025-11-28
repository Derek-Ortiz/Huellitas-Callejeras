import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(): Observable<any> {
    console.log('🔐 === INICIANDO LOGIN ===');
    console.log('📤 Enviando credenciales:', { nombre: 'anne', contrasena: 'anne123' });
    
    return this.http.post('http://localhost:8080/api/auth/login', {
      nombre: 'anne',
      contrasena: 'anne123'
    }).pipe(
      tap((res: any) => {
        console.log('✅ === RESPUESTA DEL LOGIN ===');
        console.log('📥 Respuesta completa:', JSON.stringify(res, null, 2));
        
        // DEBUG DETALLADO de la estructura
        console.log('🔍 Estructura de la respuesta:');
        console.log('   - res:', res);
        console.log('   - res.success:', res?.success);
        console.log('   - res.data:', res?.data);
        console.log('   - res.data.token:', res?.data?.token);
        console.log('   - res.message:', res?.message);
        
        // MÚLTIPLES INTENTOS para encontrar el token
        let token = null;
        
        // Intento 1: estructura esperada
        if (res?.data?.token) {
          token = res.data.token;
          console.log('🎯 Token encontrado en res.data.token');
        } 
        // Intento 2: estructura diferente
        else if (res?.token) {
          token = res.token;
          console.log('🎯 Token encontrado en res.token');
        }
        // Intento 3: buscar en cualquier propiedad
        else {
          console.log('🔎 Buscando token en toda la respuesta...');
          for (const key in res) {
            if (res[key] && typeof res[key] === 'object') {
              for (const subKey in res[key]) {
                if (subKey === 'token' && res[key][subKey]) {
                  token = res[key][subKey];
                  console.log(`🎯 Token encontrado en res.${key}.${subKey}`);
                  break;
                }
              }
            }
            if (token) break;
          }
        }
        
        console.log('🔑 Token final:', token);
        
        if (token) {
          console.log('📏 Longitud del token:', token.length);
          
          // Verificar formato JWT
          const tokenParts = token.split('.');
          console.log('🔍 Partes del token JWT:', tokenParts.length);
          
          if (tokenParts.length === 3) {
            console.log('✅ Token tiene formato JWT válido');
            try {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('📋 Payload del token:', payload);
              console.log('⏰ Expiración:', new Date(payload.exp * 1000));
              console.log('👤 Nombre en token:', payload.nombre);
              console.log('🆔 ID en token:', payload.rescatistaId);
            } catch (e) {
              console.error('❌ Error decodificando payload:', e);
            }
          } else {
            console.error('❌ Token NO tiene formato JWT válido');
          }
          
          // Guardar token
          localStorage.setItem(this.tokenKey, token);
          const storedToken = localStorage.getItem(this.tokenKey);
          console.log('💾 Token guardado en localStorage:', storedToken ? '✅ ÉXITO' : '❌ FALLÓ');
          console.log('🔍 Comparación tokens:', token === storedToken ? '✅ IGUALES' : '❌ DIFERENTES');
        } else {
          console.error('❌ NO SE PUDO ENCONTRAR EL TOKEN EN LA RESPUESTA');
          console.log('🔄 Revisando estructura completa de la respuesta:');
          console.dir(res);
        }
      })
    );
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('🔎 getToken() llamado, retornando:', token ? `Token (${token.length} chars)` : 'null');
    return token;
  }

  logout() {
    console.log('🚪 Cerrando sesión, eliminando token');
    localStorage.removeItem(this.tokenKey);
  }

  isLogged(): boolean {
    const logged = !!this.getToken();
    console.log('🔐 isLogged():', logged);
    return logged;
  }
}