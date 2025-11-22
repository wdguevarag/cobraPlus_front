import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { ComprobanteCompraService } from 'src/app/Services/comprobante-compra.service';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';

@Component({
  selector: 'app-nuevo-comprobante-compra',
  templateUrl: './nuevo-comprobante-compra.component.html',
  styleUrls: ['./nuevo-comprobante-compra.component.scss']
})
export class NuevoComprobanteCompraComponent implements OnInit {
  tipoComprobanteId = 1;
  metodoPagoId = 3;

  comprobanteForm!: FormGroup;

  currentUser: any ;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private comprobanteService: ComprobanteCompraService,
    public grupoDeDatoService: GrupoDeDatoService ,
    public authService: AuthService ,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.comprobanteForm = this.fb.group({
      Usuario_ID: [this.currentUser.ID],
      Razon_Social: ['', Validators.required],
      RUC: [
        '',
        [ Validators.required]
      ],
      Tipo_Comprobante: [null, Validators.required],
      Serie: ['', Validators.required],
      Correlativo: ['', Validators.required],
      Subtotal: ['', Validators.required],
      Total_IGV: ['', Validators.required],
      Total_Pagar: ['', Validators.required],
      Fecha_Emision: ['', Validators.required],
      Concepto_Compra: ['', Validators.required],
      Medio_Pago: [null, Validators.required],
      Observacion: [''],
      Imagen: [''],
      Estado: [1, Validators.required]
    });
  }

  /**
   * Este método será llamado por <app-submit-form>.
   * Recibe un FormData ya armado con los campos indicados en [requiredFields].
   */
  submitFn(formData: FormData) {
    // Si necesitas agregar parámetros extra, por ejemplo:
    // formData.append('empresaID', 'TU_EMPRESA_ID');
    return this.comprobanteService.createComprobante(formData);
  }

  /**
   * Cuando el usuario selecciona un archivo en <app-general-upload-input-img>,
   * parcheamos el File en el FormGroup bajo la key 'Imagen'.
   */
  onFileSelected(file: File, field: string): void {
    this.comprobanteForm.patchValue({ [field]: file });
  }
}
