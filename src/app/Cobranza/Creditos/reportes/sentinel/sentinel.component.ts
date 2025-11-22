import { Component } from '@angular/core';
import { SentinelService } from 'src/app/Services/reportes-services/sentinel.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-sentinel',
  templateUrl: './sentinel.component.html',
})
export class SentinelComponent {

  ClientesSentinelFilters = [
    { field: 'v_Usuario_Nombre', type: 'select', title: 'Ejecutivo' },
  ];


  ClientesSentinelColumns = [

    { header: 'Id', field: 'ID', show: false },
    { header: 'Cod. Agencia', field: 'v_Oficina' , noNumeric: true , show: false },
    { header: 'Agencia', field: 'v_Oficina_Nombre' },
    { header: 'Ejecutivo', field: 'v_Usuario_Nombre' },
    { header: 'Cod. Cliente', field: 'ID', noNumeric: true  },
    { header: 'Cliente', field: 'v_Cliente_Nombre' },

    { header: 'Credito ID', field: 'v_ID' , noNumeric: true },

    { header: 'Fecha Vencimiento', field: 'v_Fecha_Vencimiento_Credito' , noNumeric: true  },


    { header: 'DNI', field: 'Documento' , noNumeric: true },
    { header: 'Apellido Paterno', field: 'Apellido_Paterno' },
    { header: 'Apellido Materno', field: 'Apellido_Materno' },
    { header: 'Nombres', field: 'Nombres' },

    { header: 'Saldo Capital', field: 'v_Deuda_Actual_Capital' },
    { header: 'Deuda Actual', field: 'v_Deuda_Actual' },


    { header: 'Dias Atraso', field: 'v_Mora_Acumulada'  , noNumeric: true  },


    { header: 'Dirección Domicilio', field: 'Domicilio_Direccion' },
    { header: 'Dirección Negocio', field: 'Negocio_Direccion' },


    { header: 'Estado', field: 'Estado_Credito_Cliente' },


    { header: 'Aval', field: 'v_Avalista_Nombre' },
    { header: 'Dirección Aval', field: 'v_Avalista_Direccion' },
    { header: 'Teléfono Aval', field: 'v_Avalista_Telefono', noNumeric: true  },
  ];

  ClientesSentinelData: any[] = [];

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private sentinelService: SentinelService
  ) {}

  ngOnInit(): void {
    this.sentinelService.getRegistrosSentinel().subscribe((registros) => {
      this.ClientesSentinelData = registros;
    });
  }

}
