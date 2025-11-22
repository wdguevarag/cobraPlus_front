import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../../../../Services/clientes.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { CondonacionService } from 'src/app/Services/condonacion.service';
import { CuotasCronogramaService } from 'src/app/Services/cuotas-cronograma.service';
import { Observable, Subscription, switchMap } from 'rxjs';
import { PagoService } from 'src/app/Services/pago.service';

interface Cuota {
  Nro_Cuota: number;
  Fecha_Programada: string;
  Cuota_Total: number;
  Amortizado: number;
  Interes: number;
  Mora: number;
  Atraso: number;
  Cuota_Actual: number;
  Fecha_Pago: string | null;
  Total_Pagar: number;
  Estado_Cuota: '0' | '1';
}

@Component({
  selector: 'app-single-condonacion',
  templateUrl: './single-condonacion.component.html',
  styleUrls: ['./single-condonacion.component.scss']
})
export class SingleCondonacionComponent implements OnInit, OnDestroy {

  // ——— Form & Data ————————————————————————————————
  condonacionForm!: FormGroup;
  cronogramaData: Cuota[] = [];
  selectedCuotas = new Set<number>();

  // ——— State Flags & Options ————————————————————————
  tipoOptions: { value: string; label: string }[] = [];
  tipoDisabled = false;
  manualSelectionAllowed = true;
  showFotoTransferencia = false;
  condonacionTabs = [
    { title: 'CONDONACION' },
    { title: 'FIC' },
  ];

  // ——— Model & Subscriptions ————————————————————————
  singleCondonacionId: number | null = null;
  singleCondonacionData: any = {};
  currentUser: any;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private authService: AuthService,
    private condonacionService: CondonacionService,
    private pagosService: PagoService,
    private cuotasCronogramaService: CuotasCronogramaService
  ) {}

  // ——— Lifecycle Hooks ——————————————————————————
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.inicializarFormulario();
      }
    });

    this.route.paramMap.subscribe(params => {
      this.singleCondonacionId = +params.get('id')!;
      if (this.singleCondonacionId) {
        this.clienteService.getClientesConCredito().subscribe(
          data => {
            this.singleCondonacionData = data.find(item =>
              item.ID == this.singleCondonacionId &&
              item.Credito_Estado_Credito == 1 &&
              item.Credito_Estado_Deuda == 0
            );
            this.inicializarFormulario();
            this.cargarCuotasCronograma(this.singleCondonacionData.Credito_ID);
          },
          error => console.error('Error al obtener el cliente:', error)
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ——— Initialization ——————————————————————————
  private inicializarFormulario(): void {
    if (!this.singleCondonacionData || !this.currentUser) return;

    this.condonacionForm = this.fb.group({
      Usuario_ID:         [this.currentUser.ID],
      Credito_ID:         [this.singleCondonacionData.Credito_ID],
      Motivo:             [''],
      Tipo:               [''],
      Monto_Pagado:       [''],
      Monto_Condonado:    [''],

      Comentario:         [''],

      Foto_Sustento:      [''],
      Cuotas_Condonadas: [[] as Cuota[]],


      Tipo_Pago:          [''],
      Banco:      [''],
      Transaccion:      [''],
      Fecha_Voucher:      [''],
      Foto_Transferencia: [null],

    });


    // Opciones iniciales y suscripciones
    this.setTipoOptions(this.condonacionForm.get('Motivo')!.value);

    const motivoSub = this.condonacionForm.get('Motivo')!.valueChanges
      .subscribe(val => this.setTipoOptions(val));
    this.subscriptions.add(motivoSub);

    const tipoSub = this.condonacionForm.get('Tipo')!.valueChanges
      .subscribe(() => this.applyTipoLogic());
    this.subscriptions.add(tipoSub);

    const pagoSub = this.condonacionForm.get('Tipo_Pago')!.valueChanges
      .subscribe(val => {
        this.showFotoTransferencia = val === 'TRANSFERENCIA';
        if (!this.showFotoTransferencia) {
          this.condonacionForm.patchValue({ Foto_Transferencia: null });
        }
      });
    this.subscriptions.add(pagoSub);
  }

  // ——— Data Loading ————————————————————————————
  private cargarCuotasCronograma(creditoId: number): void {
    this.cuotasCronogramaService.getEstadoCuentaCronogramaByCreditoId(creditoId)
      .subscribe({
        next: (data: any[]) => {
          this.cronogramaData = data.map(item => ({
            Nro_Cuota:        +item.Nro_Cuota,
            Fecha_Programada: item.Fecha_Programada,
            Cuota_Total:      +item.Cuota_Total,
            Amortizado:       +item.Amortizado,
            Interes:          +item.Interes,
            Mora:             +item.Mora || 0,
            Atraso:           +item.Atraso,
            Cuota_Actual:     +item.Cuota_Actual,
            Fecha_Pago:       item.Fecha_Pago,
            Total_Pagar:      +item.Total_Pagar,
            Estado_Cuota:     item.Estado_Cuota
          }));
          this.selectedCuotas.clear();
          this.applyTipoLogic();
          this.updateCuotasCondonadas();  // ← PARA QUE AL CARGAR YA SE ENVÍEN TODAS

        },
        error: err => console.error('Error al cargar cuotas:', err)
      });
  }



  
  // ——— Selection Helpers ————————————————————————
  get pendingCuotas(): Cuota[] {
    return this.cronogramaData.filter(c => c.Estado_Cuota === '0');
  }

  isSelected(nro: number): boolean {
    return this.selectedCuotas.has(nro);
  }

  isAllSelected(): boolean {
    return this.pendingCuotas.length > 0
      && this.pendingCuotas.every(c => this.selectedCuotas.has(c.Nro_Cuota));
  }


  
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.pendingCuotas.forEach(c => this.selectedCuotas.delete(c.Nro_Cuota));
    } else {
      this.pendingCuotas.forEach(c => this.selectedCuotas.add(c.Nro_Cuota));
    }
    this.recalcularMontos();
    this.updateCuotasCondonadas();  // ← parcheamos aquí
  }

  toggleSelection(cuota: Cuota): void {
    if (cuota.Estado_Cuota === '1' || !this.manualSelectionAllowed) return;
    if (this.selectedCuotas.has(cuota.Nro_Cuota)) {
      this.selectedCuotas.delete(cuota.Nro_Cuota);
    } else {
      this.selectedCuotas.add(cuota.Nro_Cuota);
    }
    this.recalcularMontos();
    this.updateCuotasCondonadas();  // ← y también aquí
  }





  private updateCuotasCondonadas(): void {
    const selectedMiniData = this.cronogramaData
      // 1) Filtramos solo las cuotas seleccionadas
      .filter(c => this.selectedCuotas.has(c.Nro_Cuota))
      // 2) Ordenamos por número de cuota
      .sort((a, b) => a.Nro_Cuota - b.Nro_Cuota)
      // 3) Mapeamos a mini‑objetos con solo Nro_Cuota y Fecha_Programada
      .map(c => ({
        Nro_Cuota: c.Nro_Cuota,
        Fecha_Programada: c.Fecha_Programada
      }));

    console.log('Cuotas condonadas (mini):', selectedMiniData);
    this.condonacionForm.patchValue({
      Cuotas_Condonadas: selectedMiniData
    });
  }




  private applyTipoLogic(): void {
    const tipo = this.condonacionForm.get('Tipo')!.value as string;

    this.selectedCuotas.clear();
    if (tipo === 'TOTAL_CUOTAS' || tipo === 'CONDONAR_INTERESES') {
      // Todas las cuotas pendientes
      this.pendingCuotas.forEach(c => this.selectedCuotas.add(c.Nro_Cuota));
      this.manualSelectionAllowed = false;
    } else {
      // PARCIAL_INTERESES → selección manual
      this.manualSelectionAllowed = true;
    }

    this.recalcularMontos();
    this.updateCuotasCondonadas();  // ← AÑADE ESTA LÍNEA
  }

  


  private recalcularMontos(): void {
    const tipo = this.condonacionForm.get('Tipo')!.value as string;
    let sumCapital = 0;
    let sumCondonar = 0;

    this.cronogramaData.forEach(c => {
      if (!this.selectedCuotas.has(c.Nro_Cuota)) return;
      if (tipo === 'TOTAL_CUOTAS') {
        sumCondonar += c.Cuota_Total;
      } else {
        sumCapital += c.Amortizado;
        sumCondonar += (c.Cuota_Total - c.Amortizado);
      }
    });

    if (tipo === 'TOTAL_CUOTAS') {
      sumCapital = 0;
    }

    this.condonacionForm.patchValue({
      Monto_Pagado:    sumCapital.toFixed(2),
      Monto_Condonado: sumCondonar.toFixed(2)
    });
  }

  // ——— Tipo Options ————————————————————————————

  
  private setTipoOptions(motivo: string): void {
    const ctrl = this.condonacionForm.get('Tipo')!;
    if (motivo === 'FALLECIMIENTO') {
      this.tipoOptions = [{ value: 'TOTAL_CUOTAS', label: 'TOTAL CUOTAS' }];
      this.tipoDisabled = true;
      ctrl.enable();
      ctrl.setValue('TOTAL_CUOTAS');
      ctrl.disable();
    }
    else if (motivo === 'ENFERMEDAD') {
      this.tipoOptions = [
        { value: 'CONDONAR_INTERESES', label: 'TOTAL INTERESES' },
        { value: 'PARCIAL_INTERESES',  label: 'PARCIAL INTERESES' }
      ];
      this.tipoDisabled = false;
      ctrl.enable();
      if (!['CONDONAR_INTERESES','PARCIAL_INTERESES'].includes(ctrl.value)) {
        ctrl.setValue('CONDONAR_INTERESES');
      }
    }
    else {
      this.tipoOptions = [
        { value: 'TOTAL_CUOTAS',       label: 'TOTAL CUOTAS' },
        { value: 'CONDONAR_INTERESES', label: 'TOTAL INTERESES' },
        { value: 'PARCIAL_INTERESES',  label: 'PARCIAL INTERESES' }
      ];
      this.tipoDisabled = false;
      ctrl.enable();
    }
  }

  // ——— File & Submit ————————————————————————————
  onFileSelected(file: File, field: string): void {
    this.condonacionForm.patchValue({ [field]: file });
  }


  

  submitFn(): Observable<any> {
    const tipoCtrl = this.condonacionForm.get('Tipo')!;
    const wasDisabled = tipoCtrl.disabled;
    if (wasDisabled) tipoCtrl.enable();

    const values = this.condonacionForm.value;
    const formData = new FormData();

    Object.entries(values).forEach(([key, val]) => {
      if (key === 'Cuotas_Condonadas') {
        formData.append(key, JSON.stringify(val));
      } else if (val instanceof File || val instanceof Blob) {
        formData.append(key, val);
      } else if (val !== null && val !== undefined) {
        formData.append(key, val.toString());
      }
    });

    if (wasDisabled) tipoCtrl.disable();

    return this.condonacionService.createCondonacion(formData);
  }



  // ——— Utility ——————————————————————————————
  public getTotal(field: keyof Cuota): number {
    return this.cronogramaData.reduce((sum, cuota) => {
      const val = cuota[field] as unknown as number;
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }


  /** Suma de Cuota_Total sólo de las cuotas pendientes */
  get deudaTotalPendiente(): number {
    return this.pendingCuotas
      .reduce((sum, c) => sum + c.Cuota_Total, 0);
  }

  /** Primer cuota pendiente (o null si no hay) */
  get primeraCuotaPendiente(): Cuota | null {
    return this.pendingCuotas.length > 0
      ? this.pendingCuotas[0]
      : null;
  }


}
