import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CobrosDiariosService } from 'src/app/Services/reportes-services/cobros-diarios.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cobros-diarios',
  templateUrl: './cobros-diarios.component.html',
})
export class CobrosDiariosComponent {

  CobrosColumns = [
  { header: 'Id', field: 'ID', show: false },
  { header: 'Agen.', field: 'v_Oficina_Nombre' },
  { header: 'Ejecutivo', field: 'v_Usuario_Nombre' },
  { header: 'Cliente', field: 'v_Cliente_Nombre' },
  { header: 'Fecha Desemb.', field: 'v_Fecha_Desembolso', noNumeric: true },
  { header: 'Credito ID', field: 'v_ID' },
  { header: 'Monto Desemb.', field: 'v_Monto_Desembolso' },
  { header: 'Plazo', field: 'v_Total_Numero_Cuotas', noNumeric: true },
  { header: 'Monto Cuota', field: 'v_Monto_Cuota' },
  { header: 'Saldo Cap.', field: 'v_Deuda_Actual_Capital' },
  { header: 'Deuda Actual', field: 'v_Deuda_Actual' },
  { header: 'Días Atra.', field: 'v_Mora_Acumulada', noNumeric: true }, 
  { header: '# Cuotas x Pagar', field: 'v_Nro_Cuotas_Pendientes', noNumeric: true },
  
  { header: 'Deuda x Pagar', field: 'v_Deuda_Por_Pagar' },
  
  { header: 'Ult. Fecha Pago', field: 'v_Ult_Pago_Fecha' , noNumeric: true},
  { header: 'Ult. Pago', field: 'v_Ult_Pago_Monto' },
  { header: 'Formas de Pago', field: 'Credito_Periodicidad' }, 
  { header: 'Aval', field: 'v_Avalista_Nombre' },
  { header: 'Dirección Aval', field: 'v_Avalista_Direccion' },
  { header: 'Telefono Aval', field: 'v_Avalista_Telefono', noNumeric: true }
];


  CobrosData: any[] = [];

  CobrosFilters = [
    { field: 'v_Oficina_Nombre', type: 'select', title: 'Agencia' },
  ];


  constructor(
    private router: Router ,
    private cobrosDiariosService: CobrosDiariosService
  ) {}

  ngOnInit(): void {
    this.cobrosDiariosService.getCobrosDiarios().subscribe((cobros) => {
      this.CobrosData = cobros;
    });
  }
}
