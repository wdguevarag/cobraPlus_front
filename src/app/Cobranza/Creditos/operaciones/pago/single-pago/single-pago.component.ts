import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { PagoService } from 'src/app/Services/pago.service';
import { PAGE_URL } from 'src/environments/environment';

@Component({
  selector: 'app-single-pago',
  templateUrl: './single-pago.component.html',
  styleUrl: './single-pago.component.scss'
})
export class SinglePagoComponent implements OnInit {
  currentUser: any;
  creditoID: number | null = null;
  creditoData: any;
  nuevoPagoForm!: FormGroup;
  mostrarCamposBanco = false;
  warningExcedente = false;

  
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
      tipo_aplicacion: ['Normal'],
      v_flag_cobro: ['',Validators.required],
      v_flag_abrio_negocio: ['',Validators.required],
      v_tipo_pago: ['Efectivo'],
      v_monto_cuota: ['', Validators.required],
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

    this.nuevoPagoForm.get('v_monto_cuota')!
      .valueChanges.subscribe(() => this.adjustPago());
    this.nuevoPagoForm.get('v_mora')!
      .valueChanges.subscribe(() => this.adjustPago());
    this.adjustPago();
  }


  private adjustPago(): void {
    if (!this.creditoData) return;

    const montoCtrl = this.nuevoPagoForm.get('v_monto_cuota')!;
    const moraCtrl = this.nuevoPagoForm.get('v_mora')!;

    let monto = +montoCtrl.value || 0;
    let moraOrig = +this.creditoData.Mora || 0;
    const deuda = +this.creditoData.Prestamo_Actual || 0;

    this.warningExcedente = false;

    // CASO: Deuda = 0 => solo permitimos monto <= 0.5
    if (deuda < 0.5) {
      if (monto > 0.5) {
        monto = 0.5;
        montoCtrl.setValue(monto, { emitEvent: false });
        this.warningExcedente = true;
      }
      moraCtrl.enable({ emitEvent: false });
    }
    // CASO GENERAL: monto no puede exceder deuda
    else if (monto > deuda) {
      const excedente = monto - deuda;
      monto = deuda;

      montoCtrl.setValue(monto, { emitEvent: false });
      moraCtrl.setValue(Math.round((moraOrig + excedente) * 100) / 100, { emitEvent: false });
      moraCtrl.disable({ emitEvent: false });

      this.warningExcedente = true;
    } else {
      moraCtrl.enable({ emitEvent: false }); // permitir editar mora si no excede
    }

    const moraFinal = +moraCtrl.value || 0;
    const total = Math.round((monto + moraFinal) * 100) / 100;

    this.nuevoPagoForm.get('v_total_pagar')!.patchValue(total, { emitEvent: false });
    this.nuevoPagoForm.get('v_recibido')!.patchValue(total, { emitEvent: false });
  }


  onFileSelected(file: File, field: string) {
    this.nuevoPagoForm.patchValue({ [field]: file });
  }

  submitFn(data: any) {
    return this.pagoService.createPago(data);
  }

  mostrarAnverso: boolean = true;

  toggleDocumento() {
    this.mostrarAnverso = !this.mostrarAnverso;
  }


}
