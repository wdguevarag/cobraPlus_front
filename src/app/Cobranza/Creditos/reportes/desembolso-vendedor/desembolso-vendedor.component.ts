import { Component } from '@angular/core';
import { DesembolsoVendedorService } from 'src/app/Services/reportes-services/desembolso-vendedor.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-desembolso-vendedor',
  templateUrl: './desembolso-vendedor.component.html'
})
export class DesembolsoVendedorComponent {
  DesembolsosFilters = [
    { field: 'v_Fecha_Registro_Sistema', type: 'date-start', title: 'Fecha Inicio' },
    { field: 'v_Fecha_Registro_Sistema', type: 'date-end', title: 'Fecha Fin' },
    { field: 'v_Oficina_Nombre', type: 'select', title: 'Oficina' }
  ];

  DesembolsosVendedorColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Fecha', field: 'v_Fecha_Registro_Sistema', noNumeric: true },
    { header: 'Oficina', field: 'v_Oficina_Nombre' },
    { header: 'Analista', field: 'v_Usuario_Nombre' },
    { header: 'Cod. Cliente', field: 'ID' },
    { header: 'Cliente', field: 'v_Cliente_Nombre' },
    { header: 'Capital', field: 'v_Deuda_Actual_Capital' },
    { header: 'Monto Cuota', field: 'v_Monto_Cuota' },
    { header: 'TNM', field: 'Credito_TNM' },
    { header: 'N° Cuotas', field: 'v_Total_Numero_Cuotas' },
    { header: 'Forma de Pago', field: 'Credito_Periodicidad' },
    { header: 'Modalidad', field: 'Credito_Tipo_Solicitud' },
    { header: 'Destino', field: 'Credito_Destino_Nombre' },
    { header: 'Fecha Desembolso', field: 'v_Fecha_Desembolso', noNumeric: true },
    { header: 'Fecha Primer Pago', field: 'v_Fecha_Primer_Pago', noNumeric: true },
    { header: 'Estado', field: 'Estado_Credito_Cliente' },
    { header: 'Usuario', field: 'Desembolsador_Nombre' }
  ];

  DesembolsosVendedorData: any[] = [];

  constructor(
    private router: Router,
    private desembolsoVendedorService: DesembolsoVendedorService
  ) {}

  ngOnInit(): void {
    this.desembolsoVendedorService.getDesembolsosVendedor().subscribe((data) => {
      this.DesembolsosVendedorData = data;
    });
  }
}
