import { Component } from '@angular/core';
import { PagosDiariosService } from 'src/app/Services/reportes-services/pagos-diarios.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pagos-diarios',
  templateUrl: './pagos-diarios.component.html',
})
export class PagosDiariosComponent {

  
  pagosColumns = [
    { header: 'Id', field: 'ID', show: false , totalLabel: 'Total'},
    { header: 'Foto',  field: 'Imagen_Transferencia', type: 'btn-img-popup',  btnLabel: 'Ver imagen',   imgDescripcion: 'Fotografía del registro' },


    { header: 'Fecha', field: 'Fecha_Sistema' , noNumeric : true},
    { header: 'Credito', field: 'Credito_ID' , noNumeric : true },
    { header: 'Oficina', field: 'Oficina_Nombre' },
    { header: 'Analista', field: 'Usuario_Nombre' },
    { header: 'Cliente', field: 'Cliente_Nombre' },
    { header: 'Monto Desembolsado', field: 'Desembolso_Total_Entregar' , sumable: true },

    { header: 'Tipo Aplicacion', field: 'Tipo_Aplicacion' },

    { header: 'Pago Parcializado', field: 'Es_Parcializado' },
    { header: 'Pago Total Parcializado', field: 'Monto_Pago_Acumulado' },


    { header: 'Total', field: 'Total_Pagar' , sumable: true },
    { header: 'Capital', field: 'Cronograma_Capital' , sumable: true},
    { header: 'Interes', field: 'Cronograma_Interes' , sumable: true},

    { header: 'Otros', field: 'Cronograma_Gastos_ADM' , sumable: true},
    { header: 'IGV', field: 'Cronograma_IGV' , sumable: true},

    { header: 'Mora', field: 'Cronograma_Mora' },


  

    { header: 'Tipo Operacion', field: 'Tipo_Pago' },

    { header: 'Banco', field: 'Banco' },
    { header: 'Transaccion', field: 'Transaccion' },

    { header: 'Fecha Voucher', field: 'Fecha_Voucher', noNumeric : true },

    { header: 'Fecha Registro Banco', field: 'Fecha_Registro_Banco' , noNumeric : true},

  ];

  pagosData: any[] = [];

  pagosFilters = [
    { field: 'Fecha_Sistema', type: 'date-start', title: 'Fecha Inicio' },
    { field: 'Fecha_Sistema', type: 'date-end', title: 'Fecha Fin' },
    { field: 'Oficina_Nombre', type: 'select', title: 'Oficina' },
    { field: 'Usuario_Nombre', type: 'select', title: 'Analista' },
    { field: 'Tipo_Pago', type: 'select', title: 'Tipo Operacion' },

  ];

  constructor( 
    private router: Router, 
    private http: HttpClient, 
    private pagosDiariosService: PagosDiariosService
  ) { }


  ngOnInit(): void {
    this.pagosDiariosService.getPagosDiarios().subscribe((ingresos) => {
      this.pagosData = ingresos;
    });
  }

}

