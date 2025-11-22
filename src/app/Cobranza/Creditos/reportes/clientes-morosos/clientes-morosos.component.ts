import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesMorososService } from 'src/app/Services/reportes-services/clientes-morosos.service'; 
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-clientes-morosos',
  templateUrl: './clientes-morosos.component.html',
})
export class ClientesMorososComponent implements OnInit {
 


  ClientesFilters = [
    { field: 'Usuario', type: 'select', title: 'Analista' },
    { field: 'Oficina', type: 'select', title: 'Oficina' },

  ];

  ClientesColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Oficina', field: 'Oficina' },
    { header: 'Analista', field: 'Usuario' },
    { header: 'Cliente', field: 'Cliente' },
    { header: 'Direccion', field: 'Cliente_Domicilio' },
    { header: 'Teléfono', field: 'Cliente_Telefono' , noNumeric: true },
    { header: 'Fecha_Desembolso', field: 'Fecha_Desembolso' , noNumeric: true },
    { header: 'N° Credito', field: 'Credito_Activo' , noNumeric: true },
    { header: 'Monto Desembolsado', field: 'Monto_Desembolso'},
    { header: 'Plazo', field: 'Total_Num_Cuotas' , noNumeric: true},
    { header: 'Monto Cuota', field: 'Monto_Cuota'  },
    { header: 'Dias Atrasado', field: 'Mora_Cuota_Actual' , noNumeric: true },
    { header: 'Prox Cuota a Pagar', field: 'Num_Cuota_Actual' , noNumeric: true },
    { header: 'N° Cuotas Atrasadas', field: 'Cuotas_Atrasadas' , noNumeric: true },
    { header: 'Deuda Atraso', field: 'Deuda_Capital'  },
    { header: 'Capital Atrasado', field: 'Deuda_Capital'  },
    { header: 'Deuda Total', field: 'Deuda_Total'  },
    { header: 'Ult. Fecha Pago', field: 'Ult_Fecha_Pago' , noNumeric: true },
    { header: 'Ult. Pago', field: 'Ult_Pago_Monto'  },
    { header: 'Cant Creditos', field: 'Num_Creditos'  },
    { header: 'Frecuencia', field: 'Frecuencia'  },
    { header: 'Estado', contentField: 'Estado'  },
    { header: 'Fecha Castigo', field: 'Fecha_Castigo' , noNumeric: true },
    { header: 'Aval', field: 'Aval'  },
    { header: 'Dirección Aval', field: 'Avalista_Direccion'  },
    { header: 'Teléfono Aval', field: 'Avalista_Telefono'  },
  ];




  ClientesData: any[] = [];



  constructor(
    private router: Router,
    private clientesMorososService: ClientesMorososService,
  ) {}

  ngOnInit(): void {
    this.clientesMorososService.getClientesMorosos().subscribe((clientes) => {
      this.ClientesData = clientes;
    });
  }
}
