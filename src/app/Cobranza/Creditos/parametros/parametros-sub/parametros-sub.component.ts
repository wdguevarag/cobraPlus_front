import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ParametroService } from 'src/app/Services/parametros.service';


@Component({
  selector: 'app-parametros-sub',
  templateUrl: './parametros-sub.component.html',
  styleUrl: './parametros-sub.component.scss'
})
export class ParametrosSubComponent {

    constructor(private router: Router, private http: HttpClient ,private parametroService: ParametroService ) {
      this.parametroService.getParametros().subscribe(response => {
        this.parametrosData = response;
      }, error => {
        console.error('Error al obtener las oficinas', error);
      });
     }

    parametrosColumns: any[] = [
      { header: 'Codigo', field: 'ID' , show: true },
      { header: 'Nombre', field: 'Nombre'},
      { header: 'Descripcion', field: 'Descripcion' },
      { header: 'Valor', field: 'Valor'},
      { header: 'Unidad de Medida', field: 'Unidad_Medida'},
      { header: 'Estado', field: 'Estado',   type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO'}
    ];
    parametrosData: any[] = [];



    onRowClick(event: { id: number, tableName?: string }): void {
      console.log('Fila seleccionada con id:', event.id);
      this.router.navigate([`/creditos/parametro/parametro/single-parametro`, event.id]);
    }

  }














