import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComprobanteCompraService } from '../../../../Services/comprobante-compra.service';

@Component({
  selector: 'app-comprobante-compra',
  templateUrl: './comprobante-compra.component.html',
  styleUrl: './comprobante-compra.component.scss'
})
export class ComprobanteCompraComponent {
  comprobantesCompraFilters = [
    { field: 'Fecha_Emision', type: 'date-start', title: 'Fecha Inicial' },
    { field: 'Fecha_Emision', type: 'date-end', title: 'Fecha Final' }
  ];

  comprobantesCompraColumns = [
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'RUC', field: 'RUC', noNumeric: true },
    { header: 'Razón Social', field: 'Razon_Social' },
    { header: 'Tipo de Comprobante', field: 'Tipo_Comprobante' },
    { header: 'Serie', field: 'Serie' },
    { header: 'Correlativo', field: 'Correlativo' },
    { header: 'SubTotal', field: 'Subtotal' },
    { header: 'IGV', field: 'Total_IGV' },
    { header: 'Total a Pagar', field: 'Total_Pagar' },
    { header: 'Fecha de Emisión', field: 'Fecha_Emision', noNumeric: true },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  comprobantesCompraData: any[] = [];

  constructor(
    private router: Router,
    private comprobantesCompraService: ComprobanteCompraService
  ) {
    this.comprobantesCompraService.getComprobantes().subscribe(
      (comprobantesCompra) => {
        this.comprobantesCompraData = comprobantesCompra;
      },
      (error) => {
        console.error('Error al obtener los comprobantes de compra', error);
      }
    );
  }

  onRowClick(event: { id: number; tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`/creditos/consulta/comprobante-compra/single-comprobante-compra`, event.id]);
  }
}
