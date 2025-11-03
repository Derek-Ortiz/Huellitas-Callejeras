import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../../../core/services/paciente.service';
import { ToastService } from '../../../../shared/toast.service';
import { Paciente } from '../../../../core/interfaces/paciente.interface';
import { HeaderComponent } from '../../../../shared/header/header';
import { StatusButtonsComponent } from '../../../../shared/status-buttons/status-buttons';
import { ExpedienteForm } from '../../expediente-form/expediente-form/expediente-form';
import { ToastComponent } from '../../../../shared/toast/toast.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expediente-edit',
  standalone: true,
  imports: [CommonModule, HeaderComponent, StatusButtonsComponent, ExpedienteForm, ToastComponent],
  templateUrl: './expediente-edit.html',
  styleUrls: ['./expediente-edit.css']
})
export class ExpedienteEdit implements OnInit {
  isEditing = false;
  pacienteEstado: 'No adoptado' | 'Adoptado' | 'En tratamiento' = 'No adoptado';
  initialPaciente: Paciente | null = null;

  constructor(private pacienteService: PacienteService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    const current = this.pacienteService.getCurrent();
    if (current) {
      this.initialPaciente = { ...current };
      this.pacienteEstado = current.estado || this.pacienteEstado;

      this.isEditing = true;
    } else {

      this.isEditing = true;
      this.initialPaciente = null;
    }


    try {
      const desired = '/expediente/editar';
      if (this.router.url !== desired) {

        this.router.navigateByUrl(desired, { replaceUrl: false });
      }
    } catch (e) {

    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.toast.show(this.isEditing ? 'Modo edición activado' : 'Modo edición desactivado');
  }

  onEstadoChange(nuevo: 'No adoptado' | 'Adoptado' | 'En tratamiento') {
    this.pacienteEstado = nuevo;
    this.toast.show('Estado actualizado: ' + nuevo);
  }

  onSave(data: any) {

    const paciente: Paciente = { ...data, estado: this.pacienteEstado } as Paciente;
    this.pacienteService.save(paciente).subscribe((saved: Paciente) => {
      this.toast.show('Cambios guardados correctamente.');
      this.isEditing = false;

      this.toast.show('Paciente guardado correctamente.');
    }, (err: unknown) => {
      this.toast.show('Error al guardar.');
    });
  }
}
