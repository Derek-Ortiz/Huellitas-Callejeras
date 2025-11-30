// services/fecha.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FechaService {

  constructor() { }

  fechaBDaInputLocal(fechaBD: string): string {
    if (!fechaBD) return '';
    
    try {
      const fecha = new Date(fechaBD);
      
      if (isNaN(fecha.getTime())) {
        console.warn('Fecha inválida desde BD:', fechaBD);
        return '';
      }
      
      const año = fecha.getUTCFullYear();
      const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getUTCDate()).padStart(2, '0');
      const horas = String(fecha.getUTCHours()).padStart(2, '0');
      const minutos = String(fecha.getUTCMinutes()).padStart(2, '0');
      
      const resultado = `${año}-${mes}-${dia}T${horas}:${minutos}`;
      
      return resultado;
    } catch (error) {
      console.error('Error convirtiendo BD a input:', error);
      return '';
    }
  }

  inputLocalAFechaBD(fechaInput: string): string {
    if (!fechaInput) return '';
    
    try {
      const fechaLocal = new Date(fechaInput);
      
      if (isNaN(fechaLocal.getTime())) {
        console.warn('Fecha input inválida:', fechaInput);
        return '';
      }
      
      const año = fechaLocal.getFullYear();
      const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaLocal.getDate()).padStart(2, '0');
      const horas = String(fechaLocal.getHours()).padStart(2, '0');
      const minutos = String(fechaLocal.getMinutes()).padStart(2, '0');
      
      const fechaBD = `${año}-${mes}-${dia}T${horas}:${minutos}:00Z`;
      
      return fechaBD;
    } catch (error) {
      console.error('Error convirtiendo input a BD:', error);
      return fechaInput;
    }
  }

  formatearFechaLegible(fechaBD: string): string {
    if (!fechaBD) return '';
    
    try {
      const fecha = new Date(fechaBD);
      
      if (isNaN(fecha.getTime())) {
        return fechaBD;
      }
      
      return fecha.toLocaleDateString('es-ES', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Error formateando fecha legible:', fechaBD);
      return fechaBD;
    }
  }

  formatearFechaParaCalendario(fechaBD: string): string {
    if (!fechaBD) return '';
    
    try {
      const fecha = new Date(fechaBD);
      
      if (isNaN(fecha.getTime())) {
        console.warn('Fecha inválida para calendario:', fechaBD);
        return '';
      }
      
      return fechaBD;
    } catch (error) {
      console.error('Error formateando fecha para calendario:', fechaBD, error);
      return '';
    }
  }

  generarFechaActualBD(): string {
    const ahora = new Date();
    
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    
    return `${año}-${mes}-${dia}T${horas}:${minutos}:00Z`;
  }

  formatearFechaRealizacion(fechaRealizacion: string): string {
    if (!fechaRealizacion) return '';
    
    try {
      const fecha = new Date(fechaRealizacion);
      
      if (isNaN(fecha.getTime())) {
        return fechaRealizacion;
      }
      
      const fechaFormateada = fecha.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const horas = String(fecha.getHours()).padStart(2, '0');
      const minutos = String(fecha.getMinutes()).padStart(2, '0');
      
      return `${fechaFormateada} a las ${horas}:${minutos}`;
    } catch (error) {
      console.error('Error formateando fecha realización:', fechaRealizacion);
      return fechaRealizacion;
    }
  }
}