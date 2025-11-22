import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { PagoService } from 'src/app/Services/pago.service';

interface TableFilter {
  field: string;
  type: string;
  title: string;
  dateDefault?: string;
}

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent implements OnInit {
  selectedOperation: number | null = null;

  pagoTabs = [{ title: 'PAGOS PENDIENTES' }, { title: 'PAGOS REALIZADOS' }];

  pagosPendientesColumns = [
    { header: 'Cliente', field: 'Cliente' },
    { header: 'Código', field: 'ID', show: true },
    { header: 'Tipo', field: 'Tipo_Solicitud' },
    { header: 'Capital', field: 'Capital' },
    { header: 'Fecha Próx. Pago', field: 'Fecha_Prox_Pago', noNumeric: true },
    { header: 'Días de Atraso', field: 'Dias_Atraso' },
    { header: 'Estado', field: 'Estado' }
  ];

  pagosRealizadosColumns = [
    { header: 'Cliente', field: 'Cliente' },
    { header: 'Pago ID', field: 'ID', show: true },
    { header: 'Credito ID', field: 'Credito_ID', show: true },
    { header: 'Pago', field: 'Pago_ID', show: false },
    { header: 'Capital', field: 'Capital' },


    { header: 'Cuota', field: 'Numero_Cuota_Sobre_Total' , noNumeric: true},
    
    { header: 'Fecha Final Cuota', field: 'Fecha_Pago_Cuota', noNumeric: true },
    { header: 'Fecha Pago', field: 'Fecha_Pago', noNumeric: true },
    { header: 'Tipo Aplicacion', field: 'Tipo_Aplicacion' },
    { header: 'Monto Pago', field: 'Monto_Pago' },
    { header: 'Monto Pago Acumulado', field: 'Monto_Pago_Acumulado' },
    // { header: 'Monto Pago Acumulado', field: 'Monto_Pago_Acumulado_Interes' },

    { header: 'Tipo Pago', field: 'Tipo_Pago' }
  ];

  pagosPendientes: any[] = [];
  pagosRealizados: any[] = [];

  pagoFiltersPendientes = [
    { field: 'Fecha_Prox_Pago', type: 'date-start', title: 'Fecha Inicial' },
    { field: 'Fecha_Prox_Pago', type: 'date-end', title: 'Fecha Final' ,  dateDefault: 'SISTEMA'}
  ];

  pagoFiltersRealizados = [
    { field: 'Fecha_Pago', type: 'date-start', title: 'Fecha Inicial' },
    { field: 'Fecha_Pago', type: 'date-end', title: 'Fecha Final' }
  ];

  currentUser: any;

  constructor(
    private router: Router,
    private pagoService: PagoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser?.Perfil_ID === '3') {
        // Si el perfil es 3 (por ejemplo, Asesor), se usa el ID del usuario
        this.pagoService.getPagosPendientes(this.currentUser.ID).subscribe({
          next: (data) => {
            this.pagosPendientes = data;
          },
          error: (err) => {
            console.error('Error al obtener Pagos Pendientes del asesor', err);
          }
        });

        this.pagoService.getPagosRealizados(this.currentUser.ID).subscribe({
          next: (data) => {
            this.pagosRealizados = data;
          },
          error: (err) => {
            console.error('Error al obtener Pagos Realizados del asesor', err);
          }
        });
      } else {
        // Si no es perfil 3, se obtiene todo
        this.pagoService.getPagosPendientes().subscribe({
          next: (data) => {
            this.pagosPendientes = data;
          },
          error: (err) => {
            console.error('Error al obtener Pagos Pendientes', err);
          }
        });

        this.pagoService.getPagosRealizados().subscribe({
          next: (data) => {
            this.pagosRealizados = data;
          },
          error: (err) => {
            console.error('Error al obtener Pagos Realizados', err);
          }
        });
      }
    });
  }

  onRowClick(event: { id: number }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`creditos/operacion/pago/single-pago`, event.id]);
  }
}
