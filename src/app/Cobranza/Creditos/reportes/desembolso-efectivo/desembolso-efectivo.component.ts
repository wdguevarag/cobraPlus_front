import { Component } from '@angular/core';
import { DesembolsoEfectivoService } from 'src/app/Services/reportes-services/desembolso-efectivo.service';
import { Router } from '@angular/router';
import { HttpClient

 } from '@angular/common/http';
@Component({
  selector: 'app-desembolso-efectivo',
  templateUrl: './desembolso-efectivo.component.html',
})
export class DesembolsoEfectivoComponent {

  
  desembolsoColumns = [
    { header: 'Id', field: 'ID' },
    { header: 'Imagen',   field: 'Imagen_Desembolso_Efectivo',   type: 'btn-img-popup',   btnLabel: 'Ver imagen',  imgDescripcion: 'Fotografía del registro'},
    { header: 'Fecha', field: 'Fecha', noNumeric: true }, 
    { header: 'Oficina', field: 'Oficina' }, 
    { header: 'Analista', field: 'Analista' }, 
    { header: 'Cliente', field: 'Cliente' }, 
    { header: 'Monto Efectivo', field: 'Monto_Efectivo' }, 
    { header: 'Forma Desembolso', field: 'Forma_Desembolso' }, 
    { header: 'Comentarios', field: 'Comentario' }
  ];

  desembolsoData: any[] = [];

  desembolsoFilters = [
    { field: 'Fecha_Registro_Sistema', type: 'date-start', title: 'Fecha Inicio' },
    { field: 'Fecha_Registro_Sistema', type: 'date-end', title: 'Fecha Fin' },
    { field: 'Oficina_Nombre', type: 'select', title: 'Oficina' },
    { field: 'Desembolsador_Nombre', type: 'select', title: 'Analista' },
  ];



  constructor(
    private router: Router, 
    private http: HttpClient, 
    private desembolsoEfectivoService: DesembolsoEfectivoService)
     {
  }

  ngOnInit(): void {
    this.desembolsoEfectivoService.getDesembolsosEfectivo().subscribe((data) => {
      this.desembolsoData = data;
    });
  }


}

