import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagoService } from 'src/app/Services/pago.service';
import { ExtornoService } from 'src/app/Services/extorno.service';

@Component({
  selector: 'app-nuevo-pago',
  templateUrl: './nuevo-pago.component.html',
  styleUrl: './nuevo-pago.component.scss'
})
export class NuevoPagoComponent implements OnInit {

  singlePagoRealizadoId: number | null = null;
  singlePagoRealizadoData: any;

  extornoForm!: FormGroup;

  showValidationPopup: boolean = false;
  showResultPopup: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pagoService: PagoService,
    private extornoService: ExtornoService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.extornoForm = this.fb.group({
      ID: [''],
      Tipo_Extorno: [''],
      Comentario: ['']
    });

    this.route.paramMap.subscribe(params => {
      this.singlePagoRealizadoId = +params.get('id')!;
      if (this.singlePagoRealizadoId) {
        this.pagoService.getDatosPagoRealizado(this.singlePagoRealizadoId).subscribe(
          response => {
            this.singlePagoRealizadoData = response;
            console.log('Datos del pago realizado:', this.singlePagoRealizadoData);
          },
          error => {
            console.error('Error al obtener los datos del pago realizado', error);
          }
        );
      }
    });

    this.extornoForm = this.fb.group({
      ID: [this.singlePagoRealizadoId],
      Tipo_Extorno: ['', Validators.required],
      Comentario: ['']
    });
  }

  onSubmit(): void {
    // Protección contra doble click
    if (this.isSubmitting) return;

    if (this.extornoForm.valid && this.singlePagoRealizadoId) {
      this.isSubmitting = true;
      const formData = this.extornoForm.value;

      this.extornoService.extornarPago(
        this.singlePagoRealizadoId,
        formData.Tipo_Extorno,
        formData.Comentario
      ).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          console.log('Extorno exitoso:', response);
          this.showResultPopup = true;
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error en el extorno:', err);
          // Manejo de errores y mensajes al usuario
        }
      });
    } else {
      console.warn('Formulario inválido o ID faltante');
    }
  }

  onExtorno(): void {
    this.showValidationPopup = true;
  }

  cancelValidation(): void {
    this.showValidationPopup = false;
  }

  closePopup(): void {
    const creditoId = this.singlePagoRealizadoData?.Credito_ID;
    this.router.navigate(['creditos/operacion/pago/single-pago', creditoId]); // Ajusta la ruta
  }
}
