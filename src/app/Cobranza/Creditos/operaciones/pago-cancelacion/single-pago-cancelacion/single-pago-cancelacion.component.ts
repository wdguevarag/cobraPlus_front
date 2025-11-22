import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { PagoService } from 'src/app/Services/pago.service';
import { PAGE_URL } from 'src/environments/environment';

@Component({
  selector: 'app-single-pago-cancelacion',
  templateUrl: './single-pago-cancelacion.component.html',
  styleUrl: './single-pago-cancelacion.component.scss'
})
export class SinglePagoCancelacionComponent implements OnInit {
  currentUser: any;
  creditoID: number | null = null;
  creditoData: any;
  nuevoPagoForm!: FormGroup;
  mostrarCamposBanco = false;

  
  page_url = PAGE_URL;
  
  singleClienteData: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private pagoService: PagoService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (!idParam) return;
        this.creditoID = +idParam;
        this.pagoService.getPagoById(this.creditoID).subscribe(
          data => {
            this.creditoData = data;

            this.clienteService.getClienteById(this.creditoData.Cliente_ID).subscribe(
              (data) => {
                this.singleClienteData = data;
              },
              (error) => {
                console.error('Error al obtener el cliente:', error);
              }
            );

            this.initFormConCredito();
          },
          err => console.error('Error al cargar crédito:', err)
        );
      });
    });
  }

  private initFormConCredito(): void {
    this.nuevoPagoForm = this.fb.group({
      credito_ID: [this.creditoData.ID],
      Nro_Cuota: [this.creditoData.Nro_Cuota],
      deuda_actual: [this.creditoData.Prestamo_Actual],
      usuario_ID: [this.currentUser?.ID || this.creditoData.Usuario_ID],
      tipo_aplicacion: ['Cancelacion'],
      v_flag_cobro: ['',Validators.required],
      v_flag_abrio_negocio: ['',Validators.required],
      v_tipo_pago: ['Efectivo'],
      v_monto_cuota: [{ value: 0, disabled: true }, Validators.required],
      v_mora: [0, [Validators.required, Validators.min(0)]],  
      v_total_pagar: [{ value: 0, disabled: true }],
      v_recibido:    [{ value: 0, disabled: true }],
      estado: ['1'],

      Banco: [''],
      Fecha_Voucher: [''],
      Num_Operacion: [''],
      Imagen_Banco: [''],

      Formato_Pago: ['NORMAL', Validators.required],

    });

    const deuda = +this.creditoData.Prestamo_Actual || 0;
    const montoAjustado = Math.round((deuda + 0.5) * 100) / 100;

    this.nuevoPagoForm.patchValue({
      v_monto_cuota: montoAjustado,
      v_total_pagar: montoAjustado,
      v_recibido: montoAjustado,
      v_mora: 0
    });

    this.nuevoPagoForm.get('v_tipo_pago')!
      .valueChanges.subscribe(val => {
        this.mostrarCamposBanco = (val === 'Banco');

        if (val !== 'Banco') {
          this.nuevoPagoForm.patchValue({
            Fecha_Voucher: '',
            Num_Operacion: ''
          }, { emitEvent: false });
        }
    });
  }


  onFileSelected(file: File, field: string) {
    this.nuevoPagoForm.patchValue({ [field]: file });
  }

  submitFn() {
    const data = this.nuevoPagoForm.getRawValue(); 
    return this.pagoService.createPago(data);
  }

  mostrarAnverso: boolean = true;

  toggleDocumento() {
    this.mostrarAnverso = !this.mostrarAnverso;
  }


}
