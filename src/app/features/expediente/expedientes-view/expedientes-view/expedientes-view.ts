

import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../interfaces/paciente.interface';
import { Router } from '@angular/router';
import { ConexionApiAnimales } from '../../services/conexion-api-animales';

@Component({
    selector: 'app-expedientes-view',
	standalone: false,
    templateUrl: './expedientes-view.html',
    styleUrls: ['./expedientes-view.css']
})
export class ExpedientesView implements OnInit, OnDestroy {
	@ViewChild('avatarInput') avatarInput?: ElementRef<HTMLInputElement>;
	isEditing = true; 
	pacienteEstado: 'No adoptado' | 'Adoptado' | 'En tratamiento' = 'No adoptado';
	initialPaciente: Paciente | null = null;
	selectedFiles: File[] = [];
	imagePreviews: string[] = [];
	showCancelModal = false;
	cancelMessage = '';

	constructor(
		private pacienteService: PacienteService,
		private router: Router,
		private animalesApi: ConexionApiAnimales
	) {}

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
	}

	onEstadoChange(nuevo: 'No adoptado' | 'Adoptado' | 'En tratamiento') {
		this.pacienteEstado = nuevo;
	}

	/** Mapear texto de UI a valor canonico esperado por el backend */
	private mapEstadoToBackend(estadoUi: string | undefined | null): string {
		const s = (estadoUi ?? '').toString().toLowerCase();
		if (s.includes('adopt')) return 'Adoptado';
		if (s.includes('recuper') || s.includes('recuperación') || s.includes('recuperacion')) return 'En recuperación';
		// Mapear "En tratamiento" a "En recuperación" por compatibilidad
		if (s.includes('trat')) return 'En recuperación';
		return 'No adoptado';
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
		try {
			if (!data) {
				console.warn('onSave llamado sin data, se usará objeto vacío');
				data = {};
			}

			// Construir objeto `animal` con los campos esperados por la API
			const animal: any = {
			nombre: data.nombre ?? data.nombrePaciente ?? '',
				peso: data.peso ?? data.pesoPaciente ?? undefined,
				raza: data.raza ?? data.razaPaciente ?? undefined,
				sexo: data.sexo ?? data.sexoPaciente ?? undefined,
			edad: data.edad ?? data.edadPaciente ?? undefined,
				especie: data.especie ?? data.especiePaciente ?? 'Perro',
				estado: this.mapEstadoToBackend(this.pacienteEstado)
		};

		// Construir objeto `rescate`. Intentamos leer `data.rescate` o campos sueltos.
		const rescate: any = data.rescate ?? {
			lugar: data.lugar ?? data.rescateLugar ?? 'Desconocido',
			descripcion: data.descripcion ?? data.rescateDescripcion ?? ''
		};

		// Normalizar tipos: convertir `peso` y `edad` a números si vienen como strings
		try {
			if (animal.peso !== undefined && animal.peso !== null) {
				const p = typeof animal.peso === 'string' ? parseFloat(animal.peso) : Number(animal.peso);
				animal.peso = Number.isFinite(p) ? p : undefined;
			}
			if (animal.edad !== undefined && animal.edad !== null) {
				const e = typeof animal.edad === 'string' ? parseInt(animal.edad, 10) : Number(animal.edad);
				animal.edad = Number.isFinite(e) ? e : undefined;
			}
		} catch (e) {
			// no bloquear por errores de parseo
		}

		// Si falta rescatistaId, intentar obtenerlo del token JWT o localStorage
		if (!animal.rescatistaId) {
			try {
				const token = localStorage.getItem('auth_token');
				if (token && token.split('.').length === 3) {
					const pl = JSON.parse(atob(token.split('.')[1]));
					animal.rescatistaId = pl.sub ?? pl.id ?? pl.userId ?? pl.rescatistaId ?? animal.rescatistaId;
				}
			} catch (e) {}
			if (!animal.rescatistaId) {
				const stored = localStorage.getItem('rescatista_id');
				if (stored) animal.rescatistaId = stored;
			}
		}

		const payload = { animal, rescate };


			// Tomar la primera imagen si se seleccionó alguna
			const file = Array.isArray(this.selectedFiles) && this.selectedFiles.length > 0 ? this.selectedFiles[0] : undefined;

			// Llamada al servicio que envía multipart/form-data (animal, rescate, imagen)
			this.animalesApi.crearConRescateFormData(payload, file).subscribe(
				(res) => {
					// Aquí `res` es la respuesta `data` del backend: manejar según necesidad
					this.isEditing = false;
					this.clearImagePreviews();
					// Opcional: navegar o mostrar mensaje
				},
				(err) => {
					console.error('Error creando animal con rescate:', err);
				}
			);
		} catch (err) {
			console.error('Exception en onSave:', err, 'data:', data);
		}
	}


	onFormCancel() {
		this.cancelMessage = '¿Deseas cancelar la creación de este expediente?';
		this.showCancelModal = true;
	}

	onModalConfirm() {
		this.showCancelModal = false;
		this.isEditing = false;
		this.clearImagePreviews();
	}

	onModalCancel() {
		this.showCancelModal = false;
	}
}

