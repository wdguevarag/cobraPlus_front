import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DesembolsoService } from 'src/app/Services/desembolso.service';
import { RefinanciacionService } from 'src/app/Services/refinanciacion.service';
import { of } from 'rxjs';
import { CondonacionService } from 'src/app/Services/condonacion.service';
import { PagoCancelacionService } from 'src/app/Services/pago-cancelacion.service';
import { PagoService } from 'src/app/Services/pago.service';
import { ExtornoService } from 'src/app/Services/extorno.service';
import { tap, map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-extorno',
  templateUrl: './extorno.component.html',
  styleUrls: ['./extorno.component.scss']
})
export class ExtornoComponent implements OnInit {
  selectedOperation: number | null = null;

  // Columnas
  columnsDesembolsoNormal = [
    { header: 'Codigo', field: 'ID' },
    { header: 'Crédito', field: 'Credito_ID' },
    { header: 'Fecha', field: 'Fecha_Registro', noNumeric: true },
    { header: 'Tipo Transacción', field: 'TipoTransaccion' },
    { header: 'Cliente', field: 'Cliente' },
    { header: 'DNI', field: 'Documento_Cliente', noNumeric: true },
    { header: 'Importe', field: 'Importe' }
  ];
  columnsDesembolsoAmpliacion = [...this.columnsDesembolsoNormal];

  columnsRefinanciacion = [
    { header: 'Codigo', field: 'ID' },
    { header: 'Crédito', field: 'Credito_ID' },
    { header: 'Crédito Anterior', field: 'Credito_ID_Anterior' },
    { header: 'Cliente', field: 'Cliente' },
    { header: 'Préstamo', field: 'Prestamo' },
    { header: 'Fecha', field: 'Fecha_Registro', noNumeric: true },
  ];

  columnsCondonacion = [
    { header: 'Cod. Cliente', field: 'ID', show: true },
    { header: 'Tipo Doc', field: 'Cliente_Tipo_Documento_Nombre' },
    { header: 'Doc', field: 'Cliente_Documento', noNumeric: true },
    { header: 'Apellido Paterno', field: 'Cliente_Apellido_Paterno' },
    { header: 'Apellido Materno', field: 'Cliente_Apellido_Materno' },
    { header: 'Usuario', field: 'Usuario_Nombre_Corto' },
    { header: 'Credito', field: 'Credito_ID' },
    { header: 'Fecha Registro', field: 'Fecha_Registro', noNumeric: true }
  ];

  columnsPagoNormal =  [
    { header: 'Pago ID', field: 'ID', show: true },
    { header: 'Credito ID', field: 'Credito_ID', show: true },
    { header: 'Pago', field: 'Pago_ID', show: false },
    { header: 'Cliente', field: 'Cliente' },
    { header: 'Capital', field: 'Capital' },


    { header: 'Cuota', field: 'Numero_Cuota_Sobre_Total' , noNumeric: true},
    
    { header: 'Fecha Final Cuota', field: 'Fecha_Pago_Cuota', noNumeric: true },
    { header: 'Fecha Pago', field: 'Fecha_Pago', noNumeric: true },
    { header: 'Monto Pago', field: 'Monto_Pago' },
    { header: 'Monto Pago Acumulado', field: 'Monto_Pago_Acumulado' },
    { header: 'Tipo Pago', field: 'Tipo_Pago' }
  ];



  columnsPagoCancelacion = [
    { header: 'ID', field: 'ID', show: true },
    { header: 'Credito_ID', field: 'Credito_ID' },
    { header: 'Asesor', contentField: 'Asesor_Nombre + " " + Asesor_Apellido' },
    { header: 'Cliente', contentField: 'Cliente_Nombre + " " + Cliente_Apellido_Paterno' },
    { header: 'Atraso', field: 'Atraso' },
    { header: 'Deuda_Actual', field: 'Deuda_Actual' },
    { header: 'Deuda_Ajustada', field: 'Deuda_Ajustada' },
    { header: 'Fecha_Registro', field: 'Fecha_Registro', noNumeric: true },
    { header: 'Monto', field: 'Monto' },
    { header: 'Nro_Cuota', field: 'Nro_Cuota' },
    { header: 'Oficina', field: 'Oficina_Nombre' },
    { header: 'TEM', field: 'TEM' }
  ];

  // Filtros (se inicializarán en ngOnInit)
  desembolsoNormalFilters: any[];
  desembolsoAmpliacionFilters: any[];
  refinanciacionFilters: any[];
  condonacionFilters: any[];
  pagoNormalFilters: any[];
  pagoCancelacionFilters: any[];

  // Datos
  dataDesembolsoNormal: any[] = [];
  dataDesembolsoAmpliacion: any[] = [];
  dataRefinanciacion: any[] = [];
  dataCondonacion: any[] = [];
  dataPagoNormal: any[] = [];
  dataPagoCancelacion: any[] = [];

  currentUser: any;

  constructor(
    private router: Router,
    private desembolsoService: DesembolsoService,
    private refinanciacionService: RefinanciacionService,
    private pagoService: PagoService,
    private pagoCancelacionService: PagoCancelacionService,
    private extornoService: ExtornoService,
    private authService: AuthService,
    private condonacionService: CondonacionService
  ) {}

  ngOnInit(): void {

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    // 1) Leo fecha sistema (DD-MM-YYYY) guardada en localStorage
    const fechaSistema = localStorage.getItem('fechaSistemaStorage') || '';
      console.log('🗓️ Fecha sistema recuperada:', fechaSistema);  


    // 2) Inicializo manualmente cada array de filtros con dateDefault
    this.desembolsoNormalFilters = [
      { field: 'Fecha_Registro', type: 'date-start', title: 'Fecha Inicial', dateDefault: fechaSistema },
      { field: 'Fecha_Registro', type: 'date-end',   title: 'Fecha Final' }
    ];
    this.desembolsoAmpliacionFilters = [
      { field: 'Fecha_Registro', type: 'date-start', title: 'Fecha Inicial', dateDefault: fechaSistema },
      { field: 'Fecha_Registro', type: 'date-end',   title: 'Fecha Final' }
    ];
    this.refinanciacionFilters = [
      { field: 'Fecha_Registro', type: 'date-start', title: 'Fecha Inicial', dateDefault: fechaSistema },
      { field: 'Fecha_Registro', type: 'date-end',   title: 'Fecha Final' }
    ];
    this.condonacionFilters = [
      { field: 'Fecha_Registro', type: 'date-start', title: 'Fecha Inicial', dateDefault: fechaSistema },
      { field: 'Fecha_Registro', type: 'date-end',   title: 'Fecha Final' }
    ];
    this.pagoNormalFilters = [
      { field: 'Fecha_Registro', type: 'date-start', title: 'Fecha Inicial', dateDefault: fechaSistema },
      { field: 'Fecha_Registro', type: 'date-end',   title: 'Fecha Final' }
    ];
    this.pagoCancelacionFilters = [
      { field: 'Fecha_Registro', type: 'date-start', title: 'Fecha Inicial', dateDefault: fechaSistema },
      { field: 'Fecha_Registro', type: 'date-end',   title: 'Fecha Final' }
    ];

    // 3) Cargo datos y dejo que <app-general-table> reciba los filtros ya listos
    this.loadAllData();
  }

  loadAllData(): void {
    // Desembolsos
    this.desembolsoService.getDesembolsosClientesCreditos().pipe(
      tap(raw => console.log('▶▶ Desembolsos crudos:', raw)),
      map(data => data.filter(item =>
        item.Estado_Aprobado === '1' &&
        item.Estado_Anulado_Credito !== '1'
      )),
      map(data => data.map(item => ({
        ...item,
        TipoTransaccion: 'DESEMBOLSO ' + (item.Tipo_Credito ?? ''),
        Cliente: `${item.Nombres_Cliente} ${item.Apellido_Paterno_Cliente} ${item.Apellido_Materno_Cliente}`,
        Importe: item.Prestamo_Credito
      }))),
      catchError(err => { console.error(err); return of([]); })
    ).subscribe(data => {
      this.dataDesembolsoNormal     = data.filter(d => d.Tipo_Credito?.toLowerCase() === 'normal' && d.Estado == '0' && d.Tipo_Credito !== 'Refinanciacion' && d.Estado_Aprobado == '1');
      this.dataDesembolsoAmpliacion     = data.filter(d => d.Tipo_Credito?.toLowerCase() === 'ampliacion' && d.Estado == '0' && d.Tipo_Credito !== 'Refinanciacion' && d.Estado_Aprobado == '1');
    });

    // Refinanciación
    // this.extornoService.obtenerRefinanciaciones().pipe(
    //   map(data => data.map(item => ({
    //     ...item,
    //     Fecha: item.Fecha_Registro,
    //     Importe: item.Prestamo
    //   }))),
    //   catchError(() => of([]))
    // ).subscribe(data => this.dataRefinanciacion = data);


    this.refinanciacionService.getRefinanciacionDataTable().subscribe(refinanciones => {
      this.dataRefinanciacion = refinanciones.filter(ref => ref.Estado === '0');
    });





    // // Pagos normal y cancelación
    // this.extornoService.getPagosNormal().subscribe(data => this.dataPagoNormal = data);

    this.pagoService.getPagosRealizadosExtorno().subscribe(data => this.dataPagoNormal = data)


    this.extornoService.getPagosCancelacion().subscribe(data => this.dataPagoCancelacion = data);

    // Condonación
    this.condonacionService.getCondonacionesCredito().subscribe(data =>
      this.dataCondonacion = data.filter(item => item.Estado_Aprobado !== '1' && item.Estado_Anulado !== '1')
    );
  }

  onRowClick(event: { id: number }): void {
    this.router.navigate(
      ['/creditos/operacion/extorno/single-extorno', event.id],
      { queryParams: { operation: this.selectedOperation } }
    );
  }
}
