import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { TransferenciaService } from 'src/app/Services/transferencias.service';
import { PAGE_URL } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-single-transferencia',
  templateUrl: './single-transferencia.component.html',
  styleUrls: ['./single-transferencia.component.scss']
})
export class SingleTransferenciaComponent implements OnInit {
  tabs = [
    { title: 'TRANSFERENCIA' },
    { title: 'DOCUMENTO' },
    { title: 'FIC' }
  ];
  intercambioImgDni = true;
  currentUser: any;
  page_url = PAGE_URL;
  transferenciaID: number | null = null;
  clienteData: any;
  cuentaActiva: any;
  singleTransferenciaData: any = {};
  showStep2 = false;
  transferenciaForm!: FormGroup;

  documentoSinFirmaError = false;
  flagLlamoError = false;
  flagConfirmoError = false;
  flagConformeError = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private transferenciaService: TransferenciaService,
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.route.params.subscribe(params => {
      this.transferenciaID = +params['id'];
      if (this.transferenciaID) {
        this.transferenciaService
          .getTransferenciaClienteCreditoById(this.transferenciaID)
          .subscribe(transferencia => {
            this.singleTransferenciaData = transferencia;
            this.initForm();

            if (this.singleTransferenciaData.Cliente_ID) {
              this.clienteService
                .getClienteById(this.singleTransferenciaData.Cliente_ID)
                .subscribe(cliente => {
                  this.clienteData = cliente;
                  if (this.clienteData) {
                    this.clienteService
                      .getCuentasByCliente(this.clienteData.ID)
                      .subscribe({
                        next: cuentas => {
                          this.cuentaActiva = cuentas.find(c => c.Principal == '1');
                          if (this.cuentaActiva) {
                            // Una vez tengamos la cuenta, parcheamos el control Banco_Destino
                            if (this.transferenciaForm) {
                              this.transferenciaForm.patchValue({
                                Banco_Destino: this.cuentaActiva.Banco
                              });
                            }
                          }
                        },
                        error: err => {
                          console.error('Error al obtener cuentas:', err);
                        }
                      });
                  }
                });
            }
          });
      }
    });
  }

  get isEfectivo(): boolean {
    return this.singleTransferenciaData?.Tipo_Desembolso === 'EFECTIVO';
  }

  get isTransferenciaEfectivo(): boolean {
    const tipo = this.singleTransferenciaData?.Tipo_Desembolso;
    return tipo === 'TRANSFERENCIA-EFECTIVO' || tipo === 'TRANSFERENCIA-ASESOR';
  }

  get requiredFields(): string[] {
    const campos = ['Comentario', 'Imagen_Transferencia'];

    if (this.isTransferenciaEfectivo) {
      campos.push('Monto_Efectivo', 'Imagen_Efectivo');
      }else {
      campos.push('Banco_Origen', 'Fecha_Voucher', 'Nro_Operacion' , 'Monto_Transferido');
    }

    return campos;
  }

  intercambiarImagenes() {
    this.intercambioImgDni = !this.intercambioImgDni;
  }

  showStep2Div(): void {
    const docFirmado = this.singleTransferenciaData.Firmado_Desembolso == '1';
    const comentarioControl = this.transferenciaForm.get('Comentario');
    const comentarioValido = comentarioControl?.valid ?? false;
    const flagLlamo = this.transferenciaForm.get('Flag_Cliente_Llamo')?.value === 1;
    const flagConfirmo = this.transferenciaForm.get('Flag_Cliente_Confirmo')?.value === 1;
    const flagConforme = this.transferenciaForm.get('Flag_Cliente_Conforme')?.value === 1;

    this.documentoSinFirmaError = !docFirmado;
    this.flagLlamoError = !flagLlamo;
    this.flagConfirmoError = !flagConfirmo;
    this.flagConformeError = !flagConforme;
    if (!comentarioValido) comentarioControl?.markAsTouched();

    this.showStep2 = (docFirmado && comentarioValido && flagLlamo && flagConfirmo && flagConforme);
  }

  hideStep2Div(): void {
    this.showStep2 = false;
  }

  finalizar(): void {
    console.log('Proceso finalizado');
  }

  initForm() {
    // Inicializamos con null/valores base; los Validators.required para Monto_Efectivo/Imagen_Efectivo sólo si es mixto
    this.transferenciaForm = this.fb.group({
      ID: [this.singleTransferenciaData.ID],
      Usuario_ID: [this.currentUser?.ID],
      Flag_Cliente_Llamo: [this.singleTransferenciaData.Flag_Cliente_Llamo],
      Flag_Cliente_Confirmo: [this.singleTransferenciaData.Flag_Cliente_Confirmo],
      Flag_Cliente_Conforme: [this.singleTransferenciaData.Flag_Cliente_Conforme],
      Cliente_ID: [this.singleTransferenciaData.Cliente_ID],
      Credito_ID: [this.singleTransferenciaData.Credito_ID],
      Comentario: [this.singleTransferenciaData.Comentario, Validators.required],
      Banco_Origen: [this.singleTransferenciaData.Banco_Origen],
      Banco_Destino: [null], // parcheado luego cuando llegue cuentaActiva
      Nro_Operacion: [this.singleTransferenciaData.Nro_Operacion],
      Imagen_Transferencia: [this.singleTransferenciaData.Imagen_Transferencia],

      Fecha_Voucher: [this.singleTransferenciaData.Fecha_Voucher],
      Monto_Transferido: [this.singleTransferenciaData.Monto_Transferido],
      Observacion: [this.singleTransferenciaData.Observacion],

      // Nuevos campos para mixto. Validación condicional:
      Monto_Efectivo: [
        this.singleTransferenciaData.Monto_Efectivo ?? null,
        this.isTransferenciaEfectivo ? Validators.required : []
      ],
      Imagen_Efectivo: [
        null,
        this.isTransferenciaEfectivo ? Validators.required : []
      ],

      Estado: [1],
    });

    // Si es EFECTIVO puro, dejamos transfer-related en 0/null
    if (this.isEfectivo) {
      this.transferenciaForm.patchValue({
        Banco_Origen: 0,
        Nro_Operacion: 0,
        Imagen_Transferencia: null
      });
    }

    this.actualizarValidadoresCamposRequeridos();

  }

  private actualizarValidadoresCamposRequeridos(): void {
    const form = this.transferenciaForm;

    if (this.isTransferenciaEfectivo) {
      form.get('Monto_Efectivo')?.setValidators(Validators.required);
      form.get('Imagen_Efectivo')?.setValidators(Validators.required);

      // No requeridos para transferencia pura
      form.get('Banco_Origen')?.clearValidators();
      form.get('Fecha_Voucher')?.clearValidators();
      form.get('Nro_Operacion')?.clearValidators();
      form.get('Monto_Transferido')?.clearValidators();
    } else if (!this.isEfectivo) {
      // Solo transferencia (no efectivo)
      form.get('Banco_Origen')?.setValidators(Validators.required);
      form.get('Fecha_Voucher')?.setValidators(Validators.required);
      form.get('Nro_Operacion')?.setValidators(Validators.required);
      form.get('Monto_Transferido')?.setValidators(Validators.required);


      form.get('Monto_Efectivo')?.clearValidators();
      form.get('Imagen_Efectivo')?.clearValidators();
    } else {
      // Si es solo EFECTIVO puro
      form.get('Monto_Efectivo')?.clearValidators();
      form.get('Imagen_Efectivo')?.clearValidators();
      form.get('Banco_Origen')?.clearValidators();
      form.get('Fecha_Voucher')?.clearValidators();
      form.get('Nro_Operacion')?.clearValidators();
      form.get('Monto_Transferido')?.clearValidators();

      form.get('Imagen_Efectivo')?.setValidators(Validators.required);
      form.get('Monto_Efectivo')?.setValidators(Validators.required);



    }

    // Actualizar validaciones
    Object.keys(form.controls).forEach(controlName => {
      form.get(controlName)?.updateValueAndValidity();
    });

    
  }

  onCheckboxSelected(controlName: string, event: any) {
    const isChecked = event.target.checked;
    this.transferenciaForm.patchValue({ [controlName]: isChecked ? 1 : 0 });
    if (controlName === 'Flag_Cliente_Llamo') this.flagLlamoError = !isChecked;
    if (controlName === 'Flag_Cliente_Confirmo') this.flagConfirmoError = !isChecked;
    if (controlName === 'Flag_Cliente_Conforme') this.flagConformeError = !isChecked;
  }

  onFileSelected(file: File, field: string) {
    this.transferenciaForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    return this.transferenciaService.editTransferencia(formData);
  }
}
