import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Animal, AnimalRequest, RescateRequest, AnimalRescateRequest } from '../../interfaces/paciente.interface';
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
    animalEstado: 'En adopción' | 'Adoptado' | 'En recuperación' = 'En adopción';
    initialAnimal: Animal | null = null;
    selectedFiles: File[] = [];
    imagePreviews: string[] = [];
    showCancelModal = false;
    cancelMessage = '';

    constructor(
        private router: Router,
        private animalesApi: ConexionApiAnimales
    ) {}

    ngOnInit(): void {
        this.initialAnimal = null;
    }

    ngOnDestroy(): void {
        this.clearImagePreviews();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }

    onEstadoChange(nuevo: 'En adopción' | 'Adoptado' | 'En recuperación') {
        this.animalEstado = nuevo;
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
                data = {};
            }

            const animalRequest: AnimalRequest = {
                nombre: data.nombre ?? data.nombrePaciente ?? '',
                peso: Number(data.peso) || 0,
                especie: data.especie ?? data.especiePaciente ?? 'Perro',
                estado: this.animalEstado,
                raza: data.raza ?? data.razaPaciente ?? '',
                edad: Number(data.edad) || 0,
                sexo: data.sexo ?? data.sexoPaciente ?? 'Macho',
                rescatistaId: this.getRescatistaIdFromStorage(),
                ...(data.fechaSalida && this.animalEstado === 'Adoptado' && { fechaSalida: data.fechaSalida })
            };

            const rescateRequest: RescateRequest = {
                lugar: data.lugar ?? data.rescateLugar ?? 'Desconocido',
                descripcion: data.descripcion ?? data.rescateDescripcion ?? ''
            };

            const payload: AnimalRescateRequest = {
                animal: animalRequest,
                rescate: rescateRequest
            };

            const file = Array.isArray(this.selectedFiles) && this.selectedFiles.length > 0 ? this.selectedFiles[0] : undefined;

            this.animalesApi.crearConRescateFormData(payload, file).subscribe(
                (res) => {
                    this.isEditing = false;
                    this.clearImagePreviews();
                    
                    if (res && (res as any).animal && (res as any).animal.id) {
                        this.router.navigate(['/expediente/edit', (res as any).animal.id]);
                    } else if (res && (res as any).id) {
                        this.router.navigate(['/expediente/edit', (res as any).id]);
                    }
                    
                    alert('Animal creado exitosamente');
                },
                (err) => {
                    console.error('Error creando animal con rescate:', err);
                    alert('Error al crear el animal. Por favor, intenta nuevamente.');
                }
            );
        } catch (err) {
            console.error('Exception en onSave:', err);
            alert('Error inesperado al procesar los datos.');
        }
    }

    private getRescatistaIdFromStorage(): string {
        try {
            const token = localStorage.getItem('auth_token');
            if (token && token.split('.').length === 3) {
                const pl = JSON.parse(atob(token.split('.')[1]));
                return pl.sub ?? pl.id ?? pl.userId ?? pl.rescatistaId ?? '';
            }
        } catch (e) {}
        
        const stored = localStorage.getItem('rescatista_id');
        return stored || 'no-encontrado';
    }

    onFormCancel() {
        this.cancelMessage = '¿Deseas cancelar la creación de este expediente?';
        this.showCancelModal = true;
    }

    onModalConfirm() {
        this.showCancelModal = false;
        this.isEditing = false;
        this.clearImagePreviews();
        this.router.navigate(['/expedientes']);
    }

    onModalCancel() {
        this.showCancelModal = false;
    }
}