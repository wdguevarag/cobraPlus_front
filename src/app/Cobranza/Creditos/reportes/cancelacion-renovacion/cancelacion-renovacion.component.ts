import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CancelacionRenovacionService } from 'src/app/Services/reportes-services/cancelacion-renovacion.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cancelacion-renovacion',
  templateUrl: './cancelacion-renovacion.component.html',
})
export class CancelacionRenovacionComponent {
  filters = [
    { id: '1', label: 'Fecha Inicio', type: 'date' },
    { id: '2', label: 'Fecha Fin', type: 'date'},
    { id: '3', label: 'Oficina', type: 'select', options: [{ value: '1', label: 'Opción 1' }, { value: '2', label: 'Opción 2' }] },
    { id: '4', label: 'Analista', type: 'select', options: [{ value: '1', label: 'Opción 1' }, { value: '2', label: 'Opción 2' }] }
  ];

  cancelacionColumns = [
  { header: 'ID', field: 'ID', show: false },
  { header: 'Fecha', field: 'Fecha', noNumeric: true },
  { header: 'Oficina', field: 'Oficina' },
  { header: 'Analista', field: 'Analista' },
  { header: 'Cliente', field: 'Cliente' },

  { header: 'Monto Desembolsado', field: 'Monto_Desembolso' },
  { header: 'Plazo', field: 'Plazo', noNumeric: true },
  { header: 'Cuota', field: 'Cuota' },

  { header: 'Monto Cancelado', field: 'Monto_Cancelado' },
  { header: '#Cuotas Canceladas', field: 'Cuotas_Canceladas' },

  { header: 'Prom Dias Mora', field: 'Prom_Dias_Mora' },
  { header: 'Mayor Dia Mora', field: 'Mayor_Dia_Mora' },


  { header: '# Creditos', field: 'Num_Creditos' },
  { header: 'Mayor Monto Desembolso', field: 'Mayor_Monto_Desembolso' }
];


  cancelacionData: any[] = [];

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private cancelacionRenovacionService: CancelacionRenovacionService
  ) {}

  ngOnInit(): void {
    this.cancelacionRenovacionService.getCancelacionRenovacion().subscribe((cancelaciones) => {
      this.cancelacionData = cancelaciones;
    });
  }
}
