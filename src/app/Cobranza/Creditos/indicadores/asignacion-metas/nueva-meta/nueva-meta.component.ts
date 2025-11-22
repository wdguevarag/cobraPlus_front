import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AsignacionMetasService } from 'src/app/Services/asignacion-metas.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-nueva-meta',
  templateUrl: './nueva-meta.component.html',
  styleUrl: './nueva-meta.component.scss'
})
export class NuevaMetaComponent implements OnInit, OnChanges {
  @Input() usuarioId!: number;
  @Input() tipoMeta!: 'MENSUAL' | 'SEMANAL';
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  metaForm!: FormGroup;
  isLoading: boolean = false;
  isEditMode: boolean = false;
  metaExistente: any = null;
  currentUser: any;

  constructor(
    private asignacionMetasService: AsignacionMetasService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.metaForm) {
        this.metaForm.patchValue({ Empresa_ID: this.currentUser.Empresa_ID });
      }
    });

    if (this.usuarioId != null && this.tipoMeta) {
      this.loadMetaActual();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['usuarioId'] && !changes['usuarioId'].firstChange) ||
      (changes['tipoMeta'] && !changes['tipoMeta'].firstChange)
    ) {
      this.resetForm();
      this.loadMetaActual();
    }
  }

  private buildForm() {
    this.metaForm = this.fb.group({
      Usuario_ID: [this.usuarioId, Validators.required],
      Empresa_ID: [null, Validators.required],
      Tipo: [this.tipoMeta, Validators.required],
      Clientes_7d: ['', [Validators.required, Validators.min(0)]],
      Cartera_7d: ['', [Validators.required, Validators.min(0)]],
      Cartera_8d: ['', [Validators.required, Validators.min(0)]],
      Mora_8d: ['', [Validators.required, Validators.min(0)]],
      Credito_Promedio: ['', [Validators.required, Validators.min(0)]],
      Desembolsos_Nuevos_Num: ['', [Validators.required, Validators.min(0)]],
      Desembolsos_Nuevos_Monto: ['', [Validators.required, Validators.min(0)]],
      ID: [null]
    });
  }

  private resetForm() {
    this.isEditMode = false;
    this.metaExistente = null;
    this.metaForm.reset({
      Usuario_ID: this.usuarioId,
      Tipo: this.tipoMeta,
      Empresa_ID: this.currentUser?.Empresa_ID
    });

    Object.keys(this.metaForm.controls).forEach(key => {
      if (['Usuario_ID', 'Empresa_ID', 'Tipo'].includes(key)) return;
      this.metaForm.get(key)?.setValue('');
    });
  }

  private loadMetaActual() {
    if (this.usuarioId == null) return;

    this.isLoading = true;
    const tipoChar = this.tipoMeta === 'MENSUAL' ? 'M' : 'S';

    this.asignacionMetasService.getMetaActualAnalista(this.usuarioId, tipoChar).subscribe(
      (data) => {
        this.isLoading = false;

        let resultado: any = null;
        if (Array.isArray(data)) {
          if (data.length > 0) resultado = data[0];
        } else if (data && typeof data === 'object') {
          resultado = Object.keys(data).length ? data : null;
        }

        if (resultado && resultado.Tiene_Meta) {
          this.isEditMode = true;
          this.metaExistente = resultado;

          const patch: any = {
            ID: resultado.ID || resultado.Meta_ID || null,
            Usuario_ID: this.usuarioId,
            Empresa_ID: this.currentUser?.Empresa_ID,
            Tipo: this.tipoMeta,
            Clientes_7d: resultado.Clientes_7d,
            Cartera_7d: resultado.Cartera_7d,
            Cartera_8d: resultado.Cartera_8d,
            Mora_8d: resultado.Mora_8d,
            Credito_Promedio: resultado.Credito_Promedio,
            Desembolsos_Nuevos_Num: resultado.Desembolsos_Nuevos_Num,
            Desembolsos_Nuevos_Monto: resultado.Desembolsos_Nuevos_Monto
          };
          this.metaForm.patchValue(patch);
        } else {
          // No hay meta
          this.isEditMode = false;
          this.metaExistente = null;
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error al validar meta actual', error);
        this.isEditMode = false;
        this.metaExistente = null;
      }
    );
  }

  onSubmit() {
    // Protección contra doble click
    if (this.metaForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const payload: any = { ...this.metaForm.value };
    payload.Tipo = this.tipoMeta;

    const operation$ = this.isEditMode && this.metaExistente
      ? this.asignacionMetasService.editMeta(payload)
      : this.asignacionMetasService.createMeta(payload);

    operation$.subscribe(
      res => {
        this.isLoading = false;
        this.guardado.emit(res);
        this.cerrar.emit();
      },
      err => {
        this.isLoading = false;
        console.error('Error en operación', err);
      }
    );
  }
}
