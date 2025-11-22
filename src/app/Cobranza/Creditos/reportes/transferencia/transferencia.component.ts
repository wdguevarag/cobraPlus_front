import { Component } from '@angular/core';
import { TransferenciaService } from 'src/app/Services/reportes-services/transferencia.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
})
export class TransferenciaComponent {

  transferenciasColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Imagen',  field: 'Imagen_Transferencia', type: 'btn-img-popup',  btnLabel: 'Ver imagen',   imgDescripcion: 'Fotografía del registro' , totalLabel: 'Total'},
    { header: 'Fecha', field: 'Fecha_Sistema_Formateada', noNumeric: true},
    { header: 'Oficina', field: 'Oficina_Nombre' },

    { header: 'Banco Origen', field: 'Banco_Origen' },
    { header: 'Banco Destino', field: 'Banco_Destino' },

    { header: 'Nro Operación', field: 'Nro_Operacion', noNumeric: true },


    { header: 'Fecha del Voucher', field: 'Fecha_Voucher_Formateada', noNumeric: true },
    { header: 'Monto Transferido', field: 'Monto' },
    { header: 'Cliente', field: 'Cliente_Nombre_Completo' },
    { header: 'Credito', field: 'Credito_ID'  , noNumeric: true},

    { header: 'Monto Desembolso', field: 'Total_Entregar'  , sumable: true},
    { header: 'Monto Entrega Cliente', field: 'Total_Transferencia'  , sumable: true },

    { header: 'Forma Desembolso', field: 'Tipo_Desembolso' },

    { header: 'Usuario Credito', field: 'Usuario_Credito_Nombre_Completo' },
    { header: 'Usuario Transferencia', field: 'Usuario_Nombre_Completo' },

    { header: 'Comentarios', field: 'Comentario' },
  ];

  transferenciasData: any[] = [];


  transferenciasFilters = [
    { field: 'Fecha_Sistema_Formateada', type: 'date-start', title: 'Fecha Inicio' },
    { field: 'Fecha_Sistema_Formateada', type: 'date-end', title: 'Fecha Fin' },
    { field: 'Oficina_Nombre', type: 'select', title: 'Oficina' },
    { field: 'Tipo_Desembolso', type: 'select', title: 'Forma Desembolso' },

  ];


  constructor(
    private router: Router, 
    private http: HttpClient, 
    private transferenciaService: TransferenciaService
  ) { }

  ngOnInit(): void {
    this.transferenciaService.getTransferencias().subscribe((data) => {
      this.transferenciasData = data;
    });
  }


}
