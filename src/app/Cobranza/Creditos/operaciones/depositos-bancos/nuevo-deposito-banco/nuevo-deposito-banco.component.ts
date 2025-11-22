import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DepositosBancosService } from 'src/app/Services/depositos-bancos.service';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nuevo-deposito-banco',
  templateUrl: './nuevo-deposito-banco.component.html',
  styleUrls: ['./nuevo-deposito-banco.component.scss']
})
export class NuevoDepositoBancoComponent implements OnInit {
  bancoElegidoId = 8;
  depositoForm!: FormGroup;
  errores: Record<string, string> = {};
  currentUser: any;
  private userSub?: Subscription;
  isSubmitting: boolean = false;

  constructor(
    private depositoService: DepositosBancosService,
    public GrupoDeDatoService: GrupoDeDatoService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // FormGroup sin lógica de fecha de sistema en el componente:
    this.depositoForm = this.fb.group({
      Usuario_ID: [null, Validators.required],
      v_Fecha_Operacion: ['', Validators.required],
      v_Banco: ['', Validators.required],
      v_Monto: [null, [Validators.required, Validators.min(0.01)]],
      v_Nro_Operacion: [null, [Validators.required, Validators.min(1)]],
      v_Fecha_Voucher: ['', Validators.required], // la directiva prellenará y validará la fecha mínima
      v_url_foto: [null, Validators.required],
      v_Estado: ['1']
    });

    // Parchear Usuario_ID cuando llega el usuario
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser?.ID) {
        this.depositoForm.patchValue({ Usuario_ID: this.currentUser.ID });
      }
    });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  onFileSelected(file: File, field: string) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.depositoForm.patchValue({ [field]: base64String });
    };
    reader.readAsDataURL(file);
  }

  /** Convierte un base64 (sin prefijo data:) a Blob */
  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers: number[] = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers.push(byteCharacters.charCodeAt(i));
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  onSubmit() {
    // Protección contra doble click
    if (this.isSubmitting) return;

    this.depositoForm.markAllAsTouched();

    if (this.depositoForm.invalid) {
      this.buildErroresDesdeValidadores();
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    const valorForm = this.depositoForm.value;
    // Append de todos los campos excepto v_url_foto
    for (const key in valorForm) {
      if (key !== 'v_url_foto') {
        // Asegurarse de convertir a string si es necesario
        formData.append(key, String(valorForm[key]));
      }
    }
    // Convertir base64 a blob y agregarlo
    const base64 = valorForm.v_url_foto;
    const blob = this.base64ToBlob(base64, 'image/png');
    formData.append('v_url_foto', blob, 'voucher.png');

    // Llamar al servicio directamente
    this.depositoService.createDepositoBancos(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.handleSuccess();
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error en el envío:', error);
        // Opcional: mostrar mensaje de error al usuario
      }
    });
  }

  private handleSuccess() {
    // Navegar a la ruta deseada tras éxito
    this.router.navigateByUrl('/creditos/operacion/deposito-bancario');
  }

  private buildErroresDesdeValidadores() {
    this.errores = {};
    const controls = this.depositoForm.controls as { [key: string]: AbstractControl };

    if (controls['v_Fecha_Operacion'].invalid) {
      if (controls['v_Fecha_Operacion'].hasError('required')) {
        this.errores['v_Fecha_Operacion'] = 'La fecha de operación es requerida';
      }
    }
    if (controls['v_Banco'].invalid) {
      if (controls['v_Banco'].hasError('required')) {
        this.errores['v_Banco'] = 'El banco donde se realizó el depósito es requerido';
      }
    }
    if (controls['v_Monto'].invalid) {
      if (controls['v_Monto'].hasError('required')) {
        this.errores['v_Monto'] = 'El monto del depósito es requerido';
      } else if (controls['v_Monto'].hasError('min')) {
        this.errores['v_Monto'] = 'El monto del depósito debe ser mayor que 0';
      }
    }
    if (controls['v_Nro_Operacion'].invalid) {
      if (controls['v_Nro_Operacion'].hasError('required')) {
        this.errores['v_Nro_Operacion'] = 'El número de operación del depósito es requerido';
      } else if (controls['v_Nro_Operacion'].hasError('min')) {
        this.errores['v_Nro_Operacion'] = 'El número de operación del depósito debe ser mayor o igual a 1';
      }
    }
    if (controls['v_Fecha_Voucher'].invalid) {
      if (controls['v_Fecha_Voucher'].hasError('required')) {
        this.errores['v_Fecha_Voucher'] = 'La fecha que aparece en el voucher de pago es requerida';
      }
    }
    if (controls['v_url_foto'].invalid) {
      if (controls['v_url_foto'].hasError('required')) {
        this.errores['v_url_foto'] = 'La foto del voucher de pago es requerida';
      }
    }
  }
}
