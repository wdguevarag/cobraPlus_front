import { Component } from '@angular/core';
import { CondonacionService } from 'src/app/Services/reportes-services/condonacion.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-condonacion',
  templateUrl: './condonacion.component.html',
})
export class CondonacionComponent {

  filters = [
    { id: '1', label: 'Fecha Inicio', type: 'date' },
    { id: '2', label: 'Fecha Fin', type: 'date' },
    { id: '3', label: 'Oficina', type: 'select', options: [{ value: '1', label: 'Oficina A' }, { value: '2', label: 'Oficina B' }] }
  ];

  condonacionColumns: any[] = [
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Fecha', field: 'Fecha_Sistema_Creacion' , noNumeric: true },
    { header: 'Credito', field: 'Credito_ID' },
    { header: 'Oficina', field: 'Oficina_Nombre' },
    { header: 'Estado', field: 'Estado' },
    // { header: 'Analista', field: 'Usuario_Registro' },
    { header: 'Analista', field: 'Usuario_Credito' },

    { header: 'Cliente', field: 'Cliente_Nombre_Completo' },
    { header: 'Motivo de Condonacion', field: 'Motivo' },
    { header: 'Tipo', field: 'Tipo' },
    { header: 'Monto Operacion', field: 'Monto_Pagado' },
    { header: 'Monto Condonado', field: 'Monto_Condonado' },
    { header: 'Foto Prueba', field: 'Foto_Transferencia' , type: 'btn-img-popup',  btnLabel: 'Ver imagen',   imgDescripcion: 'Fotografía del registro' },
    { header: 'Usuario Aprobacion', field: 'Usuario_Aprobacion' },
    { header: 'Fecha Aprobacion', field: 'Fecha_Sistema_Aprobacion_Formateada' , noNumeric: true },
    { header: 'Usuario Anulacion', field: 'Usuario_Anulacion' },
    { header: 'Fecha Anulacion', field: 'Fecha_Sistema_Anulacion_Formateada' , noNumeric: true },
    { header: 'Comentario Anulacion', field: 'Comentario_Anulacion' },
    { header: 'Tipo Operacion', field: 'Tipo' },
    { header: 'Banco', field: 'Banco' },
    { header: 'Transaccion', field: 'Transaccion' },
    { header: 'Fecha Voucher', field: 'Fecha_Voucher_Formateada' , noNumeric: true },
    { header: 'Comentario', field: 'Comentario' },

  ];

  condonacionesData: any[] = [];

  constructor(private router: Router, private http: HttpClient, private condonacionService: CondonacionService) {
    this.condonacionService.getCondonaciones().subscribe(response => {
      this.condonacionesData = response;
    }, error => {
      console.error('Error al obtener las condonaciones', error);
    });
  }

  ngOnInit(): void {
    this.condonacionService.getCondonaciones().subscribe((data) => {
      this.condonacionesData = data;
    });
  }

}
