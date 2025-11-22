import { Component } from '@angular/core';
import { ChequesEmitidosService } from 'src/app/Services/reportes-services/cheques-emitidos.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cheques-emitidos',
  templateUrl: './cheques-emitidos.component.html',
})
export class ChequesEmitidosComponent {
  filters = [
    { id: '1', label: 'Fecha Inicio', type: 'date'},
    { id: '2', label: 'Fecha Fin', type: 'date'},
    { id: '3', label: 'Oficina', type: 'select', options: [{ value: '1', label: 'Opción 1' }, { value: '2', label: 'Opción 2' }] },
    { id: '4', label: 'Bancos', type: 'select', options: [{ value: '1', label: 'Opción 1' }, { value: '2', label: 'Opción 2' }] }
  ];

  chequesColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Imagen', field: 'Imagen' },
    { header: 'Fecha', field: 'Fecha' , noNumeric: true},
    { header: 'Agencia', field: 'Agencia' },
    { header: 'Banco', field: 'Banco' },
    { header: 'Número Cheque', field: 'Nro_Cheque' },
    { header: 'Monto', field: 'Monto' },
    { header: 'Cliente', field: 'Cliente' },
    { header: 'Número Crédito', field: 'Nro_Credito' },
    { header: 'Comentario', field: 'Comentario' },
    { header: 'Usuario', field: 'Usuario' }
  ];

  chequesData: any[] = [];

  chequesFilters = [
    { field: 'Agencia', type: 'select', title: 'Agencia' },
    { field: 'Comentario', type: 'select', title: 'Comentario' },

  ];

  constructor(private router: Router, private http: HttpClient, private chequesEmitidosService: ChequesEmitidosService) {
    this.chequesEmitidosService.getChequesEmitidos().subscribe(response => {
      this.chequesData = response;
    }, error => {
      console.error('Error al obtener los cheques emitidos', error);
    });
  }

  ngOnInit(): void {
    this.chequesEmitidosService.getChequesEmitidos().subscribe((cheques) => {
      this.chequesData = cheques;
    });
  }
}
