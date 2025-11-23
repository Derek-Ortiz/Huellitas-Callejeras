

import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../interfaces/paciente.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-expedientes-view',
	standalone: false,
    templateUrl: './expedientes-view.html',
    styleUrls: ['./expedientes-view.css']
})
export class ExpedientesView implements OnInit, OnDestroy {
	@ViewChild('avatarInput') avatarInput?: ElementRef<HTMLInputElement>;
	isEditing = true; // start unlocked per request
	pacienteEstado: 'No adoptado' | 'Adoptado' | 'En tratamiento' = 'No adoptado';
	initialPaciente: Paciente | null = null;
	// archivos seleccionados y previews
	selectedFiles: File[] = [];
	imagePreviews: string[] = [];

	constructor(private pacienteService: PacienteService, private router: Router) {}

	ngOnInit(): void {
		const current = this.pacienteService.getCurrent();
		if (current) {
			this.initialPaciente = { ...current };
			this.pacienteEstado = current.estado || this.pacienteEstado;
		} else {
			this.initialPaciente = null;
		}

	}

	ngOnDestroy(): void {
		this.clearImagePreviews();
	}

	toggleEdit() {
		this.isEditing = !this.isEditing;
	// toast message removed
	}

	onEstadoChange(nuevo: 'No adoptado' | 'Adoptado' | 'En tratamiento') {
		this.pacienteEstado = nuevo;
		// toast message removed
	}

		onFilesSelected(event: Event) {
			const input = event.target as HTMLInputElement;
			if (!input.files || input.files.length === 0) return;

			this.clearImagePreviews();

			const files = Array.from(input.files);
			this.selectedFiles = files;

			for (const file of files) {
				if (!file.type.startsWith('image/')) continue;
				const url = URL.createObjectURL(file);
				this.imagePreviews.push(url);
			}
		}

		onAvatarClick(event: Event) {
			// en view la edición está activa por defecto, pero igual comprobamos
			if (!this.isEditing) { event.preventDefault(); return; }
			const input = this.avatarInput ? this.avatarInput.nativeElement : null;
			if (!input) return;
			try { input.value = ''; } catch (e) {}
			input.click();
		}

		private clearImagePreviews() {
			for (const url of this.imagePreviews) {
				try { URL.revokeObjectURL(url); } catch (e) {}
			}
			this.imagePreviews = [];
			this.selectedFiles = [];
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

