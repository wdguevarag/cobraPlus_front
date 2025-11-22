import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BoletasVentasElectronicasService } from 'src/app/Services/reportes-services/boletas-venta-electronica.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-boletas-venta-electronica',
  templateUrl: './boletas-venta-electronica.component.html',
})
export class BoletasVentaElectronicaComponent {

  
  boletasFilters = [
    { field: 'Fecha_Registro', type: 'date-start', title: 'Fecha Inicial' },
    { field: 'Fecha_Registro', type: 'date-end', title: 'Fecha Final' },
    { field: 'Usuario_Nombre', type: 'select', title: 'Usuario Registro' },
  ];


  boletasColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Imagen', field: 'Imagen' , type: 'btn-img-popup',  btnLabel: 'Ver imagen',   imgDescripcion: 'Fotografía del registro' },
    { header: 'Fecha de Emision', field: 'Fecha_Registro'  , noNumeric: true},
    { header: 'Razon Social', field: 'Razon_Social' , noNumeric: true},
    { header: 'RUC', field: 'RUC' , noNumeric: true},
    { header: 'Concepto de Compra', field: 'Concepto_Compra' , noNumeric: true},
    { header: 'Comprobante', field: 'Tipo_Comprobante' , noNumeric: true},
    { header: 'Correlativo', field: 'Correlativo' , noNumeric: true},
    { header: 'Fecha de Registro', field: 'Fecha_Registro' , noNumeric: true},
    { header: 'O. Gravada', field: 'Subtotal'},
    { header: 'IGV', field: 'Total_IGV'},
    { header: 'Monto Total', field: 'Total_Pagar'},
    { header: 'Usuario', field: 'Usuario_Nombre'},
  ];

  boletasData: any[] = [];

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private boletasVentasElectronicasService: BoletasVentasElectronicasService
  ) {}

  ngOnInit(): void {
    this.boletasVentasElectronicasService.getBoletasVentasElectronicas().subscribe((data) => {
      this.boletasData = data;
    });
  }
}
