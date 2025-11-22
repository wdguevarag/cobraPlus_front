import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ExtornoService } from 'src/app/Services/reportes-services/extorno.service';

@Component({
  selector: 'app-extorno',
  templateUrl: './extorno.component.html',
})
export class ExtornoComponent {

  extornosFilters = [
    { field: 'Fecha', type: 'date-start', title: 'Fecha Inicio' },
    { field: 'Fecha', type: 'date-end', title: 'Fecha Fin' },
    { field: 'Oficina_Nombre', type: 'select', title: 'Oficina' }
  ];

  extornosColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Fecha', field: 'Fecha' , noNumeric: true },
    { header: 'Oficina', field: 'Oficina_Nombre' },
    { header: 'Credito', field: 'Credito_ID' },

    { header: 'Cliente', field: 'Cliente_Extorno_Nombre_Completo' },
    { header: 'Tipo Operación', field: 'Tipo_Extorno' },


    { header: 'Importe', field: 'Monto' },

    { header: 'Banco', field: 'Banco' },
    { header: 'Operacion ID', field: 'Operacion_ID' },



    { header: 'Usuario Creador', field: 'Usuario_Creacion_Nombre_Completo' },
    { header: 'Usuario Extorno', field: 'Usuario_Extorno_Nombre_Completo' },

    { header: 'Fecha Extorno', field: 'Fecha' , noNumeric: true },
  ];

  extornosData: any[] = [];

  constructor(private router: Router, private http: HttpClient, private extornoService: ExtornoService) {
    this.extornoService.getExtornos().subscribe(response => {
      this.extornosData = response;
    }, error => {
      console.error('Error al obtener los extornos', error);
    });
  }

  ngOnInit(): void {
    this.extornoService.getExtornos().subscribe((extornos) => {
      this.extornosData = extornos;
    });
  }

}
