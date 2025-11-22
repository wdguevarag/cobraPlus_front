import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../../../Services/clientes.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {

    currentUser: any ;

    clientesColumns = [
      { header: 'Cliente', field: 'Nombre_Completo'},
      { header: 'Codigo', field: 'ID', show: true },
      //{ header: 'Tipo Doc', field: 'Tipo_Documento' },
      { header: 'Tipo Doc', field: 'Tipo_Documento_Nombre' },
      { header: 'Estado Civil', field: 'Estado_Civil_Nombre' },

      { header: 'DNI', field: 'Documento' , noNumeric: true},
      { header: 'Apellido Paterno', field: 'Apellido_Paterno' },
      { header: 'Apellido Materno', field: 'Apellido_Materno' },
      { header: 'Nombres', field: 'Nombres'},
      { header: 'Estado', field: 'Estado',type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
    ];
  
    clientesData: any[] = [];
  
    constructor(
      private router: Router, 
      private clienteService: ClienteService,
      private authService: AuthService
    ) {  }
    
    ngOnInit(): void {
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
      this.clienteService.getClientes().subscribe(response => {
        this.clientesData = response.filter(cliente => cliente.Empresa_ID == this.currentUser.Empresa_ID);
        console.log(this.clientesData)
      }, error => {
        console.error('Error al obtener los accesos', error);
      });
    }
    onRowClick(event: { id: number, tableName?: string }): void {
      console.log('Fila seleccionada con id:', event.id);
      this.router.navigate([`/creditos/mantenimiento/cliente/single-cliente`, event.id]);
    }

}




