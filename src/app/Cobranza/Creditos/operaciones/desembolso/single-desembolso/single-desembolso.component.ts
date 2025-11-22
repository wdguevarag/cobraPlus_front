import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import { AuthService } from 'src/app/Services/Common/Auth.service';
import { ClienteService } from 'src/app/Services/clientes.service';
import { CreditoService } from 'src/app/Services/creditos.service';
import { DesembolsoService } from 'src/app/Services/desembolso.service';
import { DocumentosCreditosService } from 'src/app/Services/documentos_creditos.service';
import { PdfGeneratorService } from 'src/app/Services/pdf-generator/pdf-generator.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

/**
 * Configuración de campos por tipo de desembolso
 */
type DesembolsoType = 'TRANSFERENCIA' | 'EFECTIVO' | 'TRANSFERENCIA-EFECTIVO' | 'TRANSFERENCIA-ASESOR';
interface FieldConfig { name: string; label: string; type: 'number' | 'text'; editable: boolean; }
const FORM_CONFIG: Record<DesembolsoType, FieldConfig[]> = {
  TRANSFERENCIA: [
    { name: 'Desembolso_Transferencia', label: 'Desembolso Transferencia', type: 'number', editable: true },
    { name: 'Pago_Voluntario',         label: 'Pago Voluntario',         type: 'number', editable: true },
    { name: 'Descuento',               label: 'Descuento',               type: 'number', editable: true }
  ],
  EFECTIVO: [
    { name: 'Desembolso_Efectivo',     label: 'Desembolso Efectivo',     type: 'number', editable: true },
    { name: 'Pago_Voluntario',         label: 'Pago Voluntario',         type: 'number', editable: true },
    { name: 'Descuento',               label: 'Descuento',               type: 'number', editable: true }
  ],
  'TRANSFERENCIA-EFECTIVO': [
    { name: 'Desembolso_Transferencia', label: 'Desembolso Transferencia', type: 'number', editable: true },
    { name: 'Desembolso_Efectivo',      label: 'Desembolso Efectivo',     type: 'number', editable: true },
    { name: 'Pago_Voluntario',          label: 'Pago Voluntario',         type: 'number', editable: true },
    { name: 'Descuento',                label: 'Descuento',               type: 'number', editable: true }
  ],
  'TRANSFERENCIA-ASESOR': [
    { name: 'Desembolso_Transferencia', label: 'Desembolso Transferencia', type: 'number', editable: true },
    { name: 'Desembolso_Efectivo', label: 'Desembolso Efectivo', type: 'number', editable: true },
    { name: 'Pago_Voluntario',         label: 'Pago Voluntario',         type: 'number', editable: true },
    { name: 'Descuento',               label: 'Descuento',               type: 'number', editable: true },
    { name: 'Efectivo_Asesor',         label: 'Efectivo Asesor',         type: 'number', editable: true },
    { name: 'Monto_Transferir_Asesor', label: 'Monto a Transferir Asesor', type: 'number', editable: true }
  ]
};

@Component({
  selector: 'app-single-desembolso',
  templateUrl: './single-desembolso.component.html',
  styleUrls: ['./single-desembolso.component.scss']
})
export class SingleDesembolsoComponent implements OnInit {
  public FORM_CONFIG = FORM_CONFIG;
  public tipos: DesembolsoType[] = Object.keys(FORM_CONFIG) as DesembolsoType[];

  public tabs = [
    { title: 'DESEMBOLSO' },
    { title: 'FIC' },
    { title: 'EVALUACION' },
    { title: 'CRONOGRAMA' },
  ];

  public selectedTipo: DesembolsoType = 'TRANSFERENCIA';
  public esAmpliacion = false;
  public dataLoaded = false;

  public visibleFields: Record<string, boolean> = {};
  public desembolsoForm!: FormGroup;

  public currentUser: any;
  public singleDesembolsoData: any = {};
  public creditoData: any;
  public clienteData: any;
  public usuarioCuentaData: any;
  public cuentaTransferencia: any = null;
  public evaluacionActiva: { ID: number } = { ID: 0 };

  public desembolsoActualAnterior = {
    Prestamo_Credito_Actual: 0,
    Prestamo_Remanente_Credito_Anterior: 0,
    ID_Credito_Actual: '',
    ID_Credito_Anterior: '',
    Tipo_Solicitud_Credito_Actual: ''
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private desembolsoService: DesembolsoService,
    private clienteService: ClienteService,
    private creditoService: CreditoService,
    private usuarioService: UsuarioService,
    private pdfService: PdfGeneratorService,
    private documentosCreditosService: DocumentosCreditosService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.route.params.subscribe(params => this.loadData(+params['id']));
  }


  private initForm(): void {
    this.desembolsoForm = this.fb.group({
      ID: [null],
      Credito_ID: [null],
      Cliente_ID: [null],
      Desembolsador_ID: [this.currentUser.ID],

      Tipo_Desembolso: [this.selectedTipo, Validators.required], // <-- aquí el cambio clave
      Desembolso_Transferencia:[null],
      Desembolso_Efectivo:     [null],
      Pago_Voluntario:         [0],
      Descuento:               [0],
      Efectivo_Asesor:         [0],
      Monto_Transferir_Asesor: [0],
      Cancelaciones:           [0],
      Monto_Virtual:           [{ value: 0, disabled: true }],
      Total_Entregar:          [{ value: 0, disabled: true }],
      Banco_Destino:           [''],
      Nro_Cuenta_Destino:      [''],
      CCI_Destino:             [''],
      Titular_Cuenta_Destino:  [''],

      Comentario: [null],
      Gastos: [null],
      Pago_Adelantado: [null],
      Tipo_Firma: [null ,  Validators.required],
      Firmado: [null],
      Fecha: [null],
      Capital: [null],
      Estado_Aprobado: [1],
      Estado: [0],
      Fecha_Registro: [null],
      Fecha_Actualizacion: [null],


        Desembolso_Monto:        [{ value: 0, disabled: true }],

    });
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.desembolsoForm.patchValue({ Desembolsador_ID: user.ID });
    });
  }



  private setupFormListeners(): void {
    // 1) Cuando cambie el tipo:
    this.desembolsoForm.get('Tipo_Desembolso')!.valueChanges.subscribe(tipo => {
      this.selectedTipo = tipo;
      this.updateVisibleFields();
      this.cargarCuentaTransferencia();

      // inicializar valores para mixtos
      if (['TRANSFERENCIA-EFECTIVO','TRANSFERENCIA-ASESOR'].includes(tipo)) {
        const total = +this.desembolsoForm.get('Total_Entregar')!.value || 0;
        this.desembolsoForm.patchValue({
          Desembolso_Transferencia: total,
          Desembolso_Efectivo:      0
        }, { emitEvent: false });
      }
    });

    // 2) Listener específico para Desembolso_Efectivo en mixtos:
    this.desembolsoForm.get('Desembolso_Efectivo')!
      .valueChanges.pipe(debounceTime(50))
      .subscribe(ef => {
        if (['TRANSFERENCIA-EFECTIVO','TRANSFERENCIA-ASESOR'].includes(this.selectedTipo)) {
          const total = +this.desembolsoForm.get('Total_Entregar')!.value || 0;
          this.desembolsoForm.get('Desembolso_Transferencia')!
            .setValue(Math.max(0, total - (+ef||0)), { emitEvent: false });
        }
      });

    // 3) Listener general que recalcula montos (virtual y total):
    this.desembolsoForm.valueChanges
      .pipe(debounceTime(50))
      .subscribe(() => this.recalcularMontos());
  }



  private loadData(id: number): void {
    if (!id) return;

    this.desembolsoService.getDesembolsoClienteCreditoById(id).subscribe(desembolso => {
      this.singleDesembolsoData = desembolso;

      // 🔧 Asignar tipo antes de crear el form
      this.selectedTipo = desembolso.Tipo_Desembolso as DesembolsoType || 'TRANSFERENCIA';

      this.initForm(); // se crea el form ahora sí con el tipo correcto

      const { Credito_ID, Cliente_ID, Asesor_ID_Cliente } = desembolso;

      // Ahora se puede aplicar el patch sin conflictos
      this.desembolsoForm.patchValue({
        ID: desembolso.ID,
        Credito_ID,
        Cliente_ID,
        Comentario: desembolso.Comentario,
        Gastos: desembolso.Gastos,
        Pago_Adelantado: desembolso.Pago_Adelantado,
        Tipo_Firma: desembolso.Tipo_Firma,
        Firmado: desembolso.Firmado,
        Fecha: desembolso.Fecha,
        Capital: desembolso.Capital,
        Fecha_Registro: desembolso.Fecha_Registro,
        Fecha_Actualizacion: desembolso.Fecha_Actualizacion,
        Pago_Voluntario: desembolso.Pago_Voluntario,
        Descuento: desembolso.Descuento,
        Efectivo_Asesor: desembolso.Efectivo_Asesor,
        Tipo_Desembolso: this.selectedTipo, // <- ya es seguro asignarlo aquí
        Desembolso_Efectivo: desembolso.Desembolso_Efectivo,
        Desembolso_Transferencia: desembolso.Desembolso_Transferencia,
        Cancelaciones: desembolso.Cancelaciones,
        Monto_Virtual: desembolso.Monto_Virtual,
        Total_Entregar: desembolso.Total_Entregar,

      }, { emitEvent: false });

      // Si está aprobado, se desactiva
      if (+desembolso.Estado_Aprobado === 1) {
        this.desembolsoForm.disable();
      }

      // cargar data relacionada
      forkJoin({
        credito: this.creditoService.getCreditoById(Credito_ID),
        cliente: this.clienteService.getClienteById(Cliente_ID),
        cuentasAsesor: this.usuarioService.getCuentasAsesor(Asesor_ID_Cliente),
        cuentasCliente: this.clienteService.getCuentasByCliente(Cliente_ID)
      }).subscribe(({ credito, cliente, cuentasAsesor, cuentasCliente }) => {
        this.creditoData = credito;
        this.clienteData = { ...cliente, Cuentas: cuentasCliente };
        this.usuarioCuentaData = cuentasAsesor.filter(c => c.Principal === '1');

        this.cuentaTransferencia = this.getCuentaTransferencia(this.selectedTipo, cuentasCliente, cuentasAsesor);
        this.setCuentaTransferenciaFormValues();

        this.loadDesembolsoAnterior(id, +desembolso.Estado_Aprobado === 1);

        this.loadEvaluaciones(Cliente_ID);

        this.setupFormListeners();   // escuchar cambios de tipo
        this.updateVisibleFields();  // mostrar campos correctos
        this.dataLoaded = true;
      });
    });
  }



  private loadDesembolsoAnterior(id: number, esAprobado: boolean = false): void {
    this.desembolsoService.getDesembolsoActualAnterior(id).subscribe(data => {
      const info = data[0];
      this.desembolsoActualAnterior = info;

      const monto = +info.Prestamo_Credito_Actual;
      const cancel = info.Tipo_Solicitud_Credito_Actual === 'Ampliacion'
        ? +info.Prestamo_Remanente_Credito_Anterior
        : 0;

      if (!esAprobado) {
        this.desembolsoForm.patchValue({
          Desembolso_Monto: monto,
          Desembolso_Transferencia: monto,
          Desembolso_Efectivo: monto,
          Cancelaciones: cancel
        }, { emitEvent: false });

        this.recalcularMontos();
      } else {
        // Solo mostrar datos sin actualizar el form (que ya está disabled)
        this.desembolsoForm.get('Desembolso_Monto')?.setValue(monto, { emitEvent: false });
        this.desembolsoForm.get('Cancelaciones')?.setValue(cancel, { emitEvent: false });
      }

      this.esAmpliacion = info.Tipo_Solicitud_Credito_Actual === 'Ampliacion';
    });
  }




  private loadEvaluaciones(clienteId: number): void {
    this.clienteService.getEvaluacionesByCliente(clienteId).subscribe(evals => {
      this.evaluacionActiva = evals.find(e => e.Estado === '1') || { ID: 0 };
    });
  }

  private recalcularMontos(): void {
    const f = this.desembolsoForm;
    const montoDesembolso = +f.get('Desembolso_Monto')!.value || 0;
    const pago      = +f.get('Pago_Voluntario')!.value   || 0;
    const descuento = +f.get('Descuento')!.value         || 0;
    const cancel   = +f.get('Cancelaciones')!.value      || 0;

    // 1) Monto Virtual = MontoDesembolso – pago – descuento – cancelaciones
    const virtual = +(montoDesembolso - pago - descuento - cancel).toFixed(2);
    f.get('Monto_Virtual')!.setValue(virtual, { emitEvent: false });

    // 2) Total a Entregar = Monto Virtual
    const total = virtual;
    f.get('Total_Entregar')!.setValue(total, { emitEvent: false });

    // 3) Distribución según tipo
    switch (this.selectedTipo) {
      case 'TRANSFERENCIA':
        f.get('Desembolso_Transferencia')!
          .setValue(total, { emitEvent: false });
        f.get('Desembolso_Transferencia')!.disable({ emitEvent: false });
        f.get('Desembolso_Efectivo')!.setValue(0, { emitEvent: false });
        f.get('Desembolso_Efectivo')!.disable({ emitEvent: false });
        break;

      case 'EFECTIVO':
        f.get('Desembolso_Efectivo')!
          .setValue(total, { emitEvent: false });
        f.get('Desembolso_Efectivo')!.disable({ emitEvent: false });
        f.get('Desembolso_Transferencia')!.setValue(0, { emitEvent: false });
        f.get('Desembolso_Transferencia')!.disable({ emitEvent: false });
        break;

        case 'TRANSFERENCIA-EFECTIVO':
        case 'TRANSFERENCIA-ASESOR':
          f.get('Desembolso_Transferencia')!.disable({ emitEvent: false });
          f.get('Desembolso_Efectivo')!.enable({ emitEvent: false });
          break;

    }
  }


  private updateVisibleFields(): void {
    this.visibleFields = {};
    (FORM_CONFIG[this.selectedTipo] || []).forEach(field => this.visibleFields[field.name] = true);
  }

  public shouldShowField(fieldName: string): boolean {
    return !!this.visibleFields[fieldName];
  }

  private getCuentaTransferencia(tipo: DesembolsoType, cuentasCliente: any[], cuentasAsesor: any[]): any {
    return tipo === 'TRANSFERENCIA-ASESOR'
      ? cuentasAsesor.find(c => c.Principal === '1') || null
      : cuentasCliente.find(c => c.Principal === '1') || null;
  }

  private cargarCuentaTransferencia(): void {
    if (!this.clienteData) { this.setCuentaTransferenciaFormValues(); return; }
    let cuenta$: Observable<any>;
    if (this.selectedTipo === 'TRANSFERENCIA-ASESOR') {
      cuenta$ = this.usuarioService.getCuentasAsesor(this.singleDesembolsoData.Asesor_ID_Cliente)
        .pipe(map(c=>c.find(x=>x.Principal==='1')));
    } else if (['TRANSFERENCIA','TRANSFERENCIA-EFECTIVO'].includes(this.selectedTipo)) {
      cuenta$ = this.clienteService.getCuentasByCliente(this.clienteData.ID)
        .pipe(map(c=>c.find(x=>x.Principal==='1')));
    } else {
      this.cuentaTransferencia = null;
      this.setCuentaTransferenciaFormValues();
      return;
    }
    cuenta$.subscribe(c=>{ this.cuentaTransferencia=c; this.setCuentaTransferenciaFormValues(); });
  }

  private setCuentaTransferenciaFormValues(): void {
    const vals = this.cuentaTransferencia
      ? {
        Banco_Destino: this.cuentaTransferencia.Banco,
        Nro_Cuenta_Destino: this.cuentaTransferencia.Nro_Cuenta,
        CCI_Destino: this.cuentaTransferencia.CCI,
        Titular_Cuenta_Destino: this.cuentaTransferencia.Titular
      }
      : { Banco_Destino:'No hay cuenta principal', Nro_Cuenta_Destino:'', CCI_Destino:'', Titular_Cuenta_Destino:'' };
    this.desembolsoForm.patchValue(vals,{emitEvent:false});
  }

  public submitFn(formData: FormData): Observable<any> {
    return this.desembolsoService.editDesembolso(formData).pipe(
      mergeMap(resp => this.crearDocumentosSinFirmar().pipe(map(()=>resp)))
    );
  }

  private crearDocumentosSinFirmar(): Observable<any> {
    const { Empresa_ID } = this.currentUser;
    const { ID: Cliente_ID } = this.clienteData;
    const { Credito_ID } = this.singleDesembolsoData;
    const pdfAval = this.creditoData.Estado_Aval===1?'SI':'NO';
    const tiposDoc = ['CONTRATO','PRESTAMO','PAGARE','CALENDARIO','TRANSFERENCIA'];
    return forkJoin(tiposDoc.map(td=>
      this.pdfService.getPdf(Cliente_ID,Credito_ID,'sin-firma',td,pdfAval).pipe(
        mergeMap(blob=>{
          const file=new File([blob],`${td}.pdf`,{type:'application/pdf'});
          const fd=new FormData();
          fd.append('Empresa_ID',Empresa_ID);
          fd.append('Cliente_ID',Cliente_ID);
          fd.append('Credito_ID',Credito_ID);
          fd.append('Tipo_Documento',td);
          fd.append('Estado','0');
          fd.append('Documento',file);
          return this.documentosCreditosService.createDocumento(fd);
        })
      )
    ));
  }
}