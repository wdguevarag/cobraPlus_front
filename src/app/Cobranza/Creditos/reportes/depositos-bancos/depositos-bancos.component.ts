import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DepositosBancosService } from 'src/app/Services/reportes-services/depositos-bancos.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-depositos-bancos',
  templateUrl: './depositos-bancos.component.html',
})
export class DepositosBancosComponent {

  DepositosFilters = [
    { field: 'Fecha_Registro', type: 'date-start', title: 'Fecha Inicio' },
    { field: 'Fecha_Registro', type: 'date-end', title: 'Fecha Fin' },
    { field: 'Banco_Nombre', type: 'select', title: 'Banco' },

  ];


  DepositosColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Foto',  field: 'url_foto', type: 'btn-img-popup',  btnLabel: 'Ver imagen',   imgDescripcion: 'Fotografía del registro' },
    { header: 'Fecha', field: 'Fecha_Registro', noNumeric: true },
    { header: 'Agencia', field: 'Oficina_Nombre' },
    { header: 'N° Operación', field: 'Nro_Operacion' , noNumeric: true},
    { header: 'Fecha Voucher', field: 'Fecha_Voucher', noNumeric: true },
    { header: 'Banco', field: 'Banco_Nombre' },
    { header: 'Monto', field: 'Monto' },
    { header: 'Usuario', field: 'Usuario_Nombre' }
  ];

  
  DepositosData: any[] = [];

  constructor( 
    private router: Router, 
    private http: HttpClient, 
    private depositosBancosService: DepositosBancosService
  ) {}

  ngOnInit(): void {
    this.depositosBancosService.getDepositosBancos().subscribe((depositos) => {
      this.DepositosData = depositos;
    });
  }
}
