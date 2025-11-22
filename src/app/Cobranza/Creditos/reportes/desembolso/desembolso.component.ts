/*
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DesembolsoService } from 'src/app/Services/reportes-services/desembolso.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-desembolso',
  templateUrl: './desembolso.component.html',
})
export class DesembolsoComponent {

  desembolsoColumns = [
    { header: 'ID', field: 'ID', show: true  , totalLabel: 'Total'},
    { header: 'Fecha', field: 'Fecha', noNumeric: true },
    { header: 'Oficina', field: 'Oficina' },
    { header: 'Analista', field: 'Analista' },
    { header: 'Codigo Cliente', field: 'Cliente_ID', noNumeric: true },
    { header: 'Credito ID', field: 'Credito_ID' },
    { header: 'Nro. Créditos', field: 'Cliente_Num_Creditos', noNumeric: true },
    { header: 'Cliente', field: 'Cliente' },
    { header: 'Plazo', field: 'Plazo', noNumeric: true },
    // { header: 'Monto Cuota', field: 'Monto_Cuota' },
    { header: 'Monto Cuota', field: 'Monto_Cuota_Interes' },

    { header: 'TNM', field: 'TNM' },
    { header: 'Importe Neto', field: 'Importe_Neto' , sumable: true },
    { header: 'Pago Adelantado', field: 'Pago_Adelantado' , sumable: true },
    { header: 'Prom Dias Mora', field: 'Prom_Dias_Mora', noNumeric: true },
    { header: 'Mayor Dia Mora', field: 'Mayor_Dias_Mora', noNumeric: true },
    { header: 'Credito Periodicidad', field: 'Periodicidad' },
    { header: 'Modalidad', field: 'Modalidad' },
    { header: 'Forma Desembolso', field: 'Forma_Desembolso' },
    { header: 'Monto Entrega Cliente', field: 'Monto_Entrega_Cliente' , sumable: true },
    { header: 'Transferencia', field: 'Desembolso_Monto_Transferencia' , sumable: true},
    { header: 'Efectivo', field: 'Desembolso_Monto_Efectivo' , sumable: true },
    { header: 'Comentarios', field: 'Comentario' },
    { header: 'Usuario', field: 'Desembolsador_Nombre' },
    { header: 'Usuario', field: 'Usuario', show: false },

    { header: 'Aval', field: 'Aval' },
    { header: 'Direccion Aval', field: 'Aval_Direccion' },
    { header: 'Telefono Aval', field: 'Aval_Telefono' ,  noNumeric: true },
    

  ];

  desembolsoData: any[] = [];

  desembolsoFilters = [
    { field: 'Fecha', type: 'date-start', title: 'Fecha Inicio' },
    { field: 'Fecha', type: 'date-end', title: 'Fecha Fin' },
    { field: 'Oficina', type: 'select', title: 'Oficina' },
    { field: 'Analista', type: 'select', title: 'Analista' },
  ];


  constructor( private router: Router, private http: HttpClient, private desembolsoService: DesembolsoService ) {
    this.desembolsoService.getDesembolsos().subscribe(response => {
      this.desembolsoData = response;
    }, error => {
      console.error('Error al obtener Desembolsos', error);
    });
  }

  ngOnInit(): void {
    this.desembolsoService.getDesembolsos().subscribe(response => {
      this.desembolsoData = response;
    });
  }
}
*/





import { Component } from '@angular/core';
import { TableQuery, TableService } from 'src/app/Services/table/table-service.service';

@Component({
  selector: 'app-desembolso',
  templateUrl: './desembolso.component.html',
})

export class DesembolsoComponent {

  constructor(
    private tableService: TableService<any>
  ) { }

  entityName = 'Desembolsos'; 

  columnsConfig = [
    { header: 'ID', field: 'ID', show: true , sortable: true , footerLabel: 'TOTAL'},
    { header: 'Fecha', field: 'Fecha', type: 'date-range' , fInicial: 'fecha_sistema'},
    { header: 'Oficina', field: 'Oficina' , type: 'select'},
    { header: 'Analista', field: 'Analista' , type: 'select'},
    { header: 'Codigo Cliente', field: 'Cliente_ID'},
    { header: 'Credito ID', field: 'Credito_ID' },
    { header: 'Nro. Créditos', field: 'Cliente_Num_Creditos'},
    { header: 'Cliente', field: 'Cliente' },
    { header: 'Plazo', field: 'Plazo'},
    { header: 'Monto Cuota', field: 'Monto_Cuota_Interes' },
    { header: 'TNM', field: 'TNM' },
    { header: 'Importe Neto', field: 'Importe_Neto' , sumable: true , numeric: true },
    { header: 'Pago Adelantado', field: 'Pago_Adelantado' , sumable: true , numeric: true },
    { header: 'Prom Dias Mora', field: 'Prom_Dias_Mora' },
    { header: 'Mayor Dia Mora', field: 'Mayor_Dias_Mora' },
    { header: 'Credito Periodicidad', field: 'Periodicidad' },
    { header: 'Modalidad', field: 'Modalidad' },
    { header: 'Forma Desembolso', field: 'Forma_Desembolso' },
    { header: 'Monto Entrega Cliente', field: 'Monto_Entrega_Cliente' , sumable: true , numeric: true },
    { header: 'Transferencia', field: 'Desembolso_Monto_Transferencia' , sumable: true , numeric: true},
    { header: 'Efectivo', field: 'Desembolso_Monto_Efectivo' , sumable: true , numeric: true },
    { header: 'Comentarios', field: 'Comentario' },
    { header: 'Usuario', field: 'Desembolsador_Nombre' },
    { header: 'Usuario', field: 'Usuario', show: false },
    { header: 'Aval', field: 'Aval' },
    { header: 'Direccion Aval', field: 'Aval_Direccion' },
    { header: 'Telefono Aval', field: 'Aval_Telefono'},
  ];

  private currentQuery!: TableQuery;

  onQueryChange(query: TableQuery) {
    this.currentQuery = query;
  }

}