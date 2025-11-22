import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../../../../Services/clientes.service';

@Component({
  selector: 'app-nueva-proyeccion-desembolso',
  templateUrl: './nueva-proyeccion-desembolso.component.html',
  styleUrl: './nueva-proyeccion-desembolso.component.scss'
})
export class NuevaProyeccionDesembolsoComponent {
  clientesColumns = [
    { header: 'Codigo', field: 'id', show: true },
    { header: 'Tipo Doc', field: 'tipoDoc' },
    { header: 'Documento', field: 'doc' , noNumeric: true },
    { header: 'Apellido Paterno', field: 'apePaterno' },
    { header: 'Apellido Materno', field: 'apeMaterno' },
    { header: 'Nombres', field: 'nombre'},
    { header: 'Estado', field: 'estado' }
  ];

  clientesData: any[] = [];

  clienteEncontrado: boolean = false;

  singleClienteData: any;

  constructor(private router: Router, private clienteService: ClienteService) {
    this.clienteService.getClientes().subscribe(clientes => {
      this.clientesData = clientes;
    });
  }

  onRowClick(event: { id: number, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.clienteEncontrado = true;
    this.singleClienteData = this.clienteService.getClienteById(2);
  }

  nuevaProyeccionDesembolsoTabs = [
    { title: 'Registro' },
    { title: 'Cliente' },
    { title: 'FIC' },
  ];

  ficClientesTabs = [
    { title: 'Domicilio' },
    { title: 'Negocio' },
    { title: 'Contacto' },
    { title: 'Documentos' },
  ];

  ficCreditosTabs = [
    { title: 'Créditos' },
  ];




  

  clienteDomiciliosData: any[] = [];
  clienteDomiciliosColumns = [
    { header: 'id', field: 'id', show: false },
    { header: 'Ubicacion', field: 'ubicacion' },
    { header: 'Direccion', field: 'direccion' },
    { header: 'Referencia', field: 'referencia' },
  ];
  clienteNegociosData: any[] = [];
  clienteNegociosColumns = [
    { header: 'id', field: 'id', show: false },
    { header: 'Nombre', field: 'nombre' },
    { header: 'Ubicacion', field: 'ubicacion' },
    { header: 'Direccion', field: 'direccion' },
    { header: 'Referencia', field: 'referencia' },
  ];

  clienteContactosData: any[] = [];
  clienteContactosColumns = [
    { header: 'id', field: 'id', show: false },
    { header: 'Categoría Contacto', field: 'catContacto' },
    { header: 'Tipo Contacto', field: 'tipoContacto' },
    { header: 'Telefono', field: 'telefono' },
    { header: 'Whatsapp', field: 'whatsapp' },
    { header: 'Correo', field: 'correo' },
    { header: 'Comentario', field: 'comentario' },
  ];

  clienteCuentasData: any[] = [];
  clienteCuentasColumns = [
    { header: 'id', field: 'id', show: false },
    { header: 'Banco', field: 'banco' },
    { header: 'Cuenta', field: 'cuenta' },
    { header: 'CCI', field: 'cci' },
    { header: 'Estado', field: 'estado' },
  ];

  clienteDocumentosData: any[] = [];
  clienteDocumentosColumns = [
    { header: 'id', field: 'id', show: false },
    { header: 'Img', field: 'ruta', type:'img' },
    { header: 'Descripcion', field: 'descripcion' },
    { header: 'Ruta', field: 'ruta' },
    { header: 'Estado', field: 'estado' },
  ];
 
  clienteFamiliaresData: any[] = [];
  clienteFamiliaresColumns = [
    { header: 'id', field: 'id', show: false },
    { header: 'Nombres', field: 'nombre'},
    { header: 'Apellido Paterno', field: 'apePaterno' },
    { header: 'Apellido Matero', field: 'apeMaterno' },
    { header: 'Tipo Documento', field: 'tipoDocumento' },
    { header: 'Documento', field: 'documento' , noNumeric: true},

  ];


  clienteRccsData: any[] = [];
  clienteRccsColumns = [
    { header: 'ClienteID', field: 'id', show: false },
    { header: 'Comentario', field: 'comentario'},
    { header: 'Ruta', field: 'ruta' },
    { header: 'Estado', field: 'estado' },

  ];

  clienteCreditosColumns = [
    { field: 'numPrest', header: 'Nº PREST.' },
    { field: 'fechaDesembolso', header: 'FECHA DESEMBOLSO' , noNumeric: true},
    { field: 'montoDesembolso', header: 'MONTO DESEMBOLSO' },
    { field: 'estado', header: 'ESTADO' },
    { field: 'fechaUltimoPago', header: 'F. ÚLTIMO PAGO' , noNumeric: true },
    { field: 'tnm', header: 'TNM %' },
    { field: 'plazo', header: 'PLAZO' },
    { field: 'cuota', header: 'CUOTA' },
    { field: 'saldoCapital', header: 'SALDO CAPITAL' },
    { field: 'deuda', header: 'DEUDA' },
    { field: 'asesor', header: 'ASESOR' },
    { field: 'diasMora', header: 'DÍAS MORA' },
    { field: 'atrasoPromedio', header: 'ATRASO PROMEDIO' },
    { field: 'atrasoMaximo', header: 'ATRASO MÁXIMO' }
  ];

  clienteCreditosData: any[] = [];



















 


}



























