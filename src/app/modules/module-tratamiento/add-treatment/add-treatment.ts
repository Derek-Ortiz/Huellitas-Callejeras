import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TreatmentModal } from '../services/treatment-modal';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TreatmentStore } from '../services/treatment-store';
import { ConexionApiTratamientos } from '../services/comexion-api-tratamiento';
import { SelectedAnimalStore } from '../../../shared/selected-animal.store';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MedicineModalSwitch } from '../services/medicine-modal';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-treatment',
  standalone: false,
  templateUrl: './add-treatment.html',
  styleUrl: './add-treatment.css',
})
export class AddTreatment implements OnDestroy {
  modalTreatmentEditOpen = false;
  modalMedicineOpen = false;
  showDeleteConfirm = false;
  fileError = false;
  nums: number[] = [];
  tratamientos: any[] = [];
  form: FormGroup;
  submitted = false;
  
  get medicines(): FormArray { 
    return this.form.get('medicines') as FormArray; 
  }
  
  editingIndex: number | null = null;
  currentInitial?: { medicamento?: string; fecha?: string; dosis?: string; repeticion?: string };
  deletingIndex: number | null = null;
  selectedFile: File | null = null;
  
  // Polling
  private routeSub?: Subscription;
  private pollingSub?: Subscription;
  private readonly POLLING_INTERVAL = 3000; // 3 segundos
  private currentAnimalId: string = '';

  constructor(
    private modalSS: TreatmentModal,
    private fb: FormBuilder,
    private store: TreatmentStore,
    private router: Router,
    private api: ConexionApiTratamientos,
    private route: ActivatedRoute,
    private medicineSwitch: MedicineModalSwitch,
    private cdr: ChangeDetectorRef  // ← AGREGAR
  ) {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      prescriptionFile: [''],
      medicines: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.modalSS.$modalTreatment.subscribe(v => {
      this.modalTreatmentEditOpen = v;
      this.cdr.detectChanges();
    });
    
    this.medicineSwitch.$modalMedicine.subscribe(v => {
      this.modalMedicineOpen = !!v;
      this.cdr.detectChanges();
    });
    
    this.routeSub = this.route.paramMap.subscribe(pm => {
      const animalId = pm.get('animalId') || (SelectedAnimalStore.get() || '');
      this.currentAnimalId = animalId;
      this.cargarTratamientos(animalId);
      this.iniciarPolling(animalId);
    });
  }

  ngOnDestroy(): void {
    try { this.routeSub?.unsubscribe(); } catch {}
    try { this.pollingSub?.unsubscribe(); } catch {}
  }

  private iniciarPolling(animalId: string): void {
    // Detener polling anterior si existe
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }

    // Polling automático cada 3 segundos
    this.pollingSub = interval(this.POLLING_INTERVAL)
      .pipe(
        switchMap(() => this.api.obtenerTratamientosPorAnimal(animalId))
      )
      .subscribe({
        next: ts => {
          console.log('[AddTreatment Polling] Lista actualizada:', ts.length);
          this.tratamientos = ts || [];
          this.nums = Array.from({ length: this.tratamientos.length }, (_, i) => i + 1);
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('[AddTreatment Polling] Error:', err);
        }
      });
  }

  private cargarTratamientos(animalId: string): void {
    this.api.obtenerTratamientosPorAnimal(animalId).subscribe({
      next: ts => {
        console.log('[AddTreatment] Tratamientos cargados:', ts.length);
        this.tratamientos = ts || [];
        this.nums = Array.from({ length: this.tratamientos.length }, (_, i) => i + 1);
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('[AddTreatment] Error al cargar tratamientos:', err);
        this.tratamientos = [];
        this.nums = [];
        this.cdr.detectChanges();
      }
    });
  }

  openAddMedicineModal() {
    this.editingIndex = null;
    this.currentInitial = undefined;
    this.modalMedicineOpen = true;
    this.cdr.detectChanges();
  }

  openEditMedicineModal(index: number) {
    this.editingIndex = index;
    const group = this.medicines.at(index) as FormGroup;
    const v = group.value as any;
    this.currentInitial = {
      medicamento: v.name,
      fecha: v.date,
      dosis: v.dose,
      repeticion: v.repetition,
    };
    this.modalMedicineOpen = true;
    this.cdr.detectChanges();
  }

  onMedicineSaved(payload: { medicamento: string; fecha: string; dosis: string; repeticion: string }) {
    const data = {
      name: payload.medicamento,
      date: payload.fecha,
      dose: payload.dosis,
      repetition: payload.repeticion,
    };
    
    if (this.editingIndex !== null) {
      (this.medicines.at(this.editingIndex) as FormGroup).patchValue(data);
    } else {
      this.medicines.push(this.fb.group(data));
    }
    
    this.editingIndex = null;
    this.currentInitial = undefined;
    this.modalMedicineOpen = false;
    this.cdr.detectChanges();
  }

  removeMedicine(i: number) {
    this.deletingIndex = i;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  confirmDelete() {
    if (this.deletingIndex !== null) {
      this.medicines.removeAt(this.deletingIndex);
    }
    this.deletingIndex = null;
    this.showDeleteConfirm = false;
    this.cdr.detectChanges();
  }

  cancelDelete() {
    this.deletingIndex = null;
    this.showDeleteConfirm = false;
    this.cdr.detectChanges();
  }

  onFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    this.selectedFile = (input.files && input.files[0]) ? input.files[0] : null;
    this.fileError = !this.selectedFile;
    this.cdr.detectChanges();
  }

  private toIso(dateStr: string): string {
    if (!dateStr) return new Date().toISOString();
    return dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00Z';
  }

  save() {
    this.submitted = true;
    this.cdr.detectChanges();
    
    if (this.form.invalid) { 
      console.error('[AddTreatment] Formulario inválido');
      return; 
    }
    
    const { startDate } = this.form.value as { startDate: string };
    const animalId = this.route.snapshot.paramMap.get('animalId') || (SelectedAnimalStore.get() || '');
    const medsControls = this.medicines.controls.map(fg => fg.value as any);
    
    if (medsControls.length === 0) {
      console.error('[AddTreatment] Debes agregar al menos un medicamento antes de guardar');
      return;
    }
    
    console.log('[AddTreatment] Creando medicamentos individualmente en /medicamentos con nombres:', medsControls.map(m => m.name));
    
    const runSequential = async () => {
      try {
        const createdIds: string[] = [];
        
        // Crear medicamentos uno por uno
        for (const m of medsControls) {
          const created = await this.api.crearMedicamento({ nombre: m.name } as any).toPromise();
          const id = (created as any)?.id;
          console.log('[AddTreatment] Medicamento creado:', created, 'UUID:', id);
          
          if (!id) { 
            throw new Error('No se recibió UUID del medicamento'); 
          }
          createdIds.push(id);
        }
        
        // Crear el tratamiento
        const formReqAny: any = {
          animalId,
          fechaInicio: this.toIso(startDate),
          medicamentos: medsControls.map((m, idx) => ({
            medicamentoId: createdIds[idx],
            nombre: m.name,
            dosis: parseFloat(m.dose) || 0.0,
            repeticion: parseFloat(m.repetition) || 0.0,
            fechaConclusion: this.toIso(m.date || startDate),
          })),
        };
        
        console.log('[AddTreatment] Enviando FormData a /tratamientos JSON:', JSON.stringify(formReqAny, null, 2), 'Archivo:', this.selectedFile);
        
        this.api.crearTratamientoFormData(formReqAny as any, this.selectedFile || undefined).subscribe({
          next: (res) => {
            console.log('[AddTreatment] ✅ Tratamiento creado exitosamente:', res);
            
            // Limpiar formulario
            this.form.reset();
            this.medicines.clear();
            this.selectedFile = null;
            this.submitted = false;
            
            // Recargar inmediatamente
            this.cargarTratamientos(animalId);
            
            // Mostrar mensaje de éxito (opcional)
            alert('Tratamiento creado exitosamente');
            
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('[AddTreatment] ❌ Error al crear tratamiento (form-data):', err, (err as any)?.error);
            this.store.addTop({ 
              name: 'Tratamiento', 
              startDate, 
              prescriptionFile: undefined, 
              medicines: [] 
            });
            
            // Mostrar mensaje de error (opcional)
            alert('Error al crear tratamiento: ' + (err.message || 'Error desconocido'));
            
            this.cdr.detectChanges();
          }
        });
      } catch (e) {
        console.error('[AddTreatment] Error creando medicamentos secuencialmente:', e);
        alert('Error al crear medicamentos: ' + (e as any).message);
        this.cdr.detectChanges();
      }
    };
    
    runSequential();
  }

  navigateHome() {
    const animalId = this.route.snapshot.paramMap.get('animalId') || (SelectedAnimalStore.get() || '');
    if (animalId) {
      this.router.navigate(['/expediente/editar', animalId]);
    } else {
      this.router.navigateByUrl('/expediente');
    }
  }

  goToTratamiento(tratamientoId: string) {
    const animalId = this.route.snapshot.paramMap.get('animalId') || (SelectedAnimalStore.get() || '');
    this.router.navigate(['/medicine/tratamiento', animalId], { queryParams: { tid: tratamientoId } });
  }
  
}