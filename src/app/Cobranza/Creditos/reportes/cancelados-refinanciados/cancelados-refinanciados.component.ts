import { Component } from '@angular/core';
import { CanceladosRefinanciadosService } from 'src/app/Services/reportes-services/cancelados-refinanciados.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-cancelados-refinanciados',
  templateUrl: './cancelados-refinanciados.component.html',
})
export class CanceladosRefinanciadosComponent {

  canceladosFilters = [
    { field: 'v_Usuario_Nombre', type: 'select', title: 'Usuario Registro' },
    { field: 'Fecha', type: 'date-start', title: 'Fecha Inicial' },
    { field: 'Fecha', type: 'date-end', title: 'Fecha Final' },
  ];

  canceladosColumns = [
    { header: 'ID', field: 'ID', show: false },
    { header: 'Fecha', field: 'Fecha', noNumeric: true },
    { header: 'Oficina', field: 'Oficina' },
    { header: 'Analista', field: 'Analista' },
    { header: 'Cliente', field: 'Cliente' },

    { header: 'Monto Desembolsado', field: 'Monto_Desembolso' },
    { header: 'Plazo', field: 'Plazo', noNumeric: true },
    { header: 'Cuota', field: 'Cuota' },

    { header: 'Monto Cancelado', field: 'Monto_Cancelado' },
    { header: '#Cuotas Canceladas', field: 'Cuotas_Canceladas' },

    { header: 'Prom Dias Mora', field: 'Prom_Dias_Mora' },
    { header: 'Mayor Dia Mora', field: 'Mayor_Dia_Mora' },

    { header: 'Tipo Cancelacion', field: 'Tipo_Cancelacion' },
    { header: 'Forma Pago', field: 'Forma_Pago' }
  ];



  canceladosData: any[] = [];

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private canceladosRefinanciadosService: CanceladosRefinanciadosService
  ) {}

  ngOnInit(): void {
    this.canceladosRefinanciadosService.getCanceladosRefinanciados().subscribe((cancelados) => {
      this.canceladosData = cancelados;
    });
  }
}
