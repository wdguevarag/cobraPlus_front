import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../../../Services/clientes.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-fic',
  templateUrl: './fic.component.html',
  styleUrl: './fic.component.scss'
})
export class FicComponent  {

    currentUser: any ;

    clientesColumns = [
      { header: 'Nombre', field: 'Nombre_Completo'},
      { header: 'Cod Credito Actual', field: 'ID', show: true },
      { header: 'Cod Cliente', field: 'Cliente_ID', show: true },
      { header: 'Documento', field: 'Documento' , noNumeric: true},
      { header: 'Contacto', field: 'Telefono' , noNumeric: true},
      { header: 'Estado', field: 'Estado',type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
    ];

    clientesData: any[] = [];

    filterColumns: any[] = [];

    constructor(
      private router: Router,
      private clienteService: ClienteService,
      private authService: AuthService
    ) {  }



    ngOnInit(): void {
      this.filterColumns = [this.clientesColumns.find(col => col.field === 'Nombre_Completo')];
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
      this.clienteService.getClientesCreditos().subscribe(response => {
        this.clientesData = response.filter(cliente => cliente.Empresa_ID == this.currentUser.Empresa_ID);
      }, error => {
        console.error('Error al obtener los accesos', error);
      });
    }



  onRowClick(event: { id: number, tableName?: string }): void {
    const credito = this.clientesData.find(cliente => cliente.ID === event.id);
    if (credito) {
      const clienteId = credito.Cliente_ID;
      console.log('Redirigiendo al Cliente_ID:', clienteId);
      this.router.navigate([`/creditos/consulta/fic/single-fic`, clienteId]);
    } else {
      console.error('No se encontró el cliente con ID:', event.id);
    }
  }

}
