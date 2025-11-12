

import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../interfaces/paciente.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-expedientes-view',
	standalone: false,
    templateUrl: './expedientes-view.html',
    styleUrls: ['./expedientes-view.css']
})
export class ExpedientesView implements OnInit {
	isEditing = true; // start unlocked per request
	pacienteEstado: 'No adoptado' | 'Adoptado' | 'En tratamiento' = 'No adoptado';
	initialPaciente: Paciente | null = null;

	constructor(private pacienteService: PacienteService, private router: Router) {}

	ngOnInit(): void {
		const current = this.pacienteService.getCurrent();
		if (current) {
			this.initialPaciente = { ...current };
			this.pacienteEstado = current.estado || this.pacienteEstado;
		} else {
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
	// toast message removed
	}

	onEstadoChange(nuevo: 'No adoptado' | 'Adoptado' | 'En tratamiento') {
		this.pacienteEstado = nuevo;
		// toast message removed
	}

	onSave(data: any) {
		const paciente: Paciente = { ...data, estado: this.pacienteEstado } as Paciente;
		this.pacienteService.save(paciente).subscribe((saved: Paciente) => {
			// toast message removed
			this.isEditing = false;
			// toast message removed
		}, (err: unknown) => {
			// toast message removed
		});
	}
}

