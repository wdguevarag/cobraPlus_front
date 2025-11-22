import { Component } from '@angular/core';
import { TableQuery, TableService } from 'src/app/Services/table/table-service.service';

@Component({
   selector: 'app-base-negativa',
   templateUrl: './base-negativa.component.html',
})


export class BaseNegativaComponent {

  constructor(
    private tableService: TableService<any>
  ) { }

  entityName = 'Base_Negativa'; 

  columnsConfig = [
    { header: 'ID', field: 'ID', sortable: true },
    { header: 'Fecha de Registro', field: 'Fecha_Sistema_Formateada' , type: 'date-range' },
    { header: 'Tipo Doc', field: 'Cliente_Tipo_Documento_Nombre' },
    { header: 'DNI/RUC', field: 'Cliente_Documento' },
    { header: 'Cliente', field: 'Cliente_Nombre_Completo' },
    { header: 'Motivo Registro', field: 'Motivo_Nombre' },
    { header: 'Comentario', field: 'Comentario' },
    { header: 'Usuario Registro', field: 'Usuario_Registro_Nombre_Completo' , type: 'select' },
    { header: 'Fecha Levantamiento', field: 'Fecha_Levantamiento_Formateada'},
    { header: 'Comentario Levantamiento', field: 'Comentario_Levantamiento' },
    { header: 'Usuario Levantamiento', field: 'Usuario_Levantamiento_Nombre_Completo'},
  ];

  private currentQuery!: TableQuery;

  onQueryChange(query: TableQuery) {
    this.currentQuery = query;
  }

}



// import { BaseNegativaService } from 'src/app/Services/reportes-services/base-negativa.service';

// baseNegativaColumns = [
//   { header: 'Id', field: 'ID', show: false },
//   { header: 'Fecha de Registro', field: 'Fecha_Sistema_Formateada' , noNumeric: true },
//   { header: 'Tipo Doc', field: 'Cliente_Tipo_Documento_Nombre' },
//   { header: 'DNI/RUC', field: 'Cliente_Documento' , noNumeric: true},
//   { header: 'Cliente', field: 'Cliente_Nombre_Completo' },
//   { header: 'Motivo Registro', field: 'Motivo_Nombre' },
//   { header: 'Comentario', field: 'Comentario' },
//   // { header: 'Usuario Registro', field: 'Usuario_ID' },
//   { header: 'Usuario Registro', field: 'Usuario_Registro_Nombre_Completo' },


//   { header: 'Fecha Levantamiento', field: 'Fecha_Levantamiento_Formateada' , noNumeric: true },
//   { header: 'Comentario Levantamiento', field: 'Comentario_Levantamiento' },
//   // { header: 'Usuario Levantamiento', field: 'Usuario_Levantamiento' },
//   { header: 'Usuario Levantamiento', field: 'Usuario_Levantamiento_Nombre_Completo' },
// ];


// baseNegativaData: any[] = [];

// baseNegativaFilters = [
//   { field: 'Usuario_Registro_Nombre_Completo', type: 'select', title: 'Usuario Registro' },
//   { field: 'Fecha_Sistema_Formateada', type: 'date-start', title: 'Fecha Inicial' },
//   { field: 'Fecha_Sistema_Formateada', type: 'date-end', title: 'Fecha Final' },
// ];
// private baseNegativaService: BaseNegativaService,

// ngOnInit(): void {
//   this.baseNegativaService.getBaseNegativa().subscribe((data) => {
//     this.baseNegativaData = data;
//   });
// }
