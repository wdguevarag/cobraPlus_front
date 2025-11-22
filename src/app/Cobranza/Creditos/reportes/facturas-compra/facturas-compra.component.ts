import { Component } from '@angular/core';
import { FacturasCompraService } from 'src/app/Services/reportes-services/facturas-compra.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-facturas-compra',
  templateUrl: './facturas-compra.component.html',
})
export class FacturasCompraComponent {
  filters = [
    { id: '1', label: 'Fecha Inicio', type: 'date' },
    { id: '2', label: 'Fecha Fin', type: 'date' },
    { id: '3', label: 'Oficina', type: 'select', options: [{ value: '1', label: 'Oficina A' }, { value: '2', label: 'Oficina B' }] },
    { id: '4', label: 'Analista', type: 'select', options: [{ value: '1', label: 'Carlos García' }, { value: '2', label: 'Ana Ruiz' }] }
  ];

  facturasColumns: any[] = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Imagen', field: 'Imagen' , type: 'btn-img-popup',  btnLabel: 'Ver imagen',   imgDescripcion: 'Fotografía del registro' },
    { header: 'Fecha de Emisión', field: 'Fecha_Emision' , noNumeric: true },
    { header: 'Razón Social', field: 'Razon_Social' },
    { header: 'RUC', field: 'RUC' },
    { header: 'Concepto de Compra', field: 'Concepto_Compra' },
    { header: 'Comprobante', field: 'Tipo_Comprobante' },
    { header: 'Correlativo', field: 'Correlativo' },
    { header: 'Fecha de Registro', field: 'Fecha_Registro' , noNumeric: true },
    { header: 'O. Gravada', field: 'Subtotal' },
    { header: 'IGV', field: 'Total_IGV' },
    { header: 'Monto Total', field: 'Total_Pagar' },
    { header: 'Usuario', field: 'Usuario_Nombre' },

  ];

  facturasData: any[] = [];

  constructor( private router: Router, private http: HttpClient, private facturasCompraService: FacturasCompraService) {
    this.facturasCompraService.getFacturasCompra().subscribe(response => {
      this.facturasData = response;
    }, error => {
      console.error('Error al obtener las facturas de compra', error);
    });
  }

  ngOnInit(): void {
    this.facturasCompraService.getFacturasCompra().subscribe((data) => {
      this.facturasData = data;
    });
  }

}
