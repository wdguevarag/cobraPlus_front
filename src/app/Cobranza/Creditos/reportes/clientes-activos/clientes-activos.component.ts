import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesActivosService } from 'src/app/Services/reportes-services/clientes-activos.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-clientes-activos',
  templateUrl: './clientes-activos.component.html',
})
export class ClientesActivosComponent {

  clientesFilters = [
    { id: '1', label: 'Fecha Inicio', type: 'date' },
    { id: '2', label: 'Fecha Fin', type: 'date' },
    { id: '3', label: 'Oficina', type: 'select', options: [{ value: '1', label: 'Oficina A' }, { value: '2', label: 'Oficina B' }] },
    { id: '4', label: 'Analista', type: 'select', options: [{ value: '1', label: 'Carlos García' }, { value: '2', label: 'Ana Ruiz' }] }
  ];

  

  clientesColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Oficina', field: 'Oficina' , totalLabel: 'Total' },
    { header: 'Analista', field: 'Usuario' },
    { header: 'Cliente', field: 'Cliente' },
    { header: 'Direccion Domicilio', field: 'Direccion_Domicilio' },
    { header: 'Direccion Negocio', field: 'Direccion_Negocio' }, 
    { header: 'Fecha_Desembolso', field: 'Fecha_Desembolso', noNumeric: true },
    { header: 'N° Credito', field: 'Credito_Activo', noNumeric: true },
    { header: 'Monto Desembolsado', field: 'Monto_Desembolso' , sumable: true },
    { header: 'Plazo', field: 'Total_Num_Cuotas', noNumeric: true },
    { header: 'Monto Cuota', field: 'Monto_Cuota' },
    // { header: 'Saldo Capital', field: 'Deuda_Capital' }, 
    { header: 'Saldo Capital', field: 'Saldo_Capital' , sumable: true }, 


    { header: 'Deuda Actual', field: 'Deuda_Actual_Atraso' , sumable: true },

    { header: '#Cuotas x Pagar', field: 'Num_Cuotas_Pendientes' }, // Equivalente
    { header: 'Dias Atrasado', field: 'Mora_Cuota_Actual', noNumeric: true },
    { header: 'Ult. Fecha Pago', field: 'Ult_Fecha_Pago', noNumeric: true },
    { header: 'Ult. Pago', field: 'Ult_Pago_Monto' },
    { header: 'Frecuencia Credito', field: 'Frecuencia' },
    { header: 'Frecuencia Cliente', field: 'Frecuencia_Cliente' },
    { header: 'Aval', field: 'Aval' },
    { header: 'Dirección Aval', field: 'Avalista_Direccion' },
    { header: 'Teléfono Aval', field: 'Avalista_Telefono', noNumeric: true }
  ];



  clientesData: any[] = [];


  constructor(private router: Router, private Http: HttpClient, private clientesActivosService: ClientesActivosService) {
    this.clientesActivosService.getClientesActivos().subscribe(response => {
      this.clientesData = response;
    }, error => {
      console.error('Error al obtener los clientes activos', error);
    });
  }

  ngOnInit(): void {
    this.clientesActivosService.getClientesActivos().subscribe((clientes) => {
      this.clientesData = clientes;
    });
  }
}
