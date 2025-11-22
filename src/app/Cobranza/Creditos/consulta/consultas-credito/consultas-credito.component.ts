import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CreditoService } from '../../../../Services/creditos.service';

@Component({
  selector: 'app-consultas-credito',
  templateUrl: './consultas-credito.component.html',
  styleUrl: './consultas-credito.component.scss'
})
export class ConsultasCreditoComponent {
    id_cliente: number = 0;

    clientesColumns = [
      { header: 'Cliente', field: 'Cliente' },
      { header: 'Credito ID', field: 'ID',  show: true }, //ID_Credito ES EL DEL VALOR PERO ID DEBE SALIR PARA LOS FILTRADOS
      { header: 'Cliente ID', field: 'ID_Cliente',  show: false },
      // { header: 'Tipo Doc', field: 'Tipo_Documento' },
      { header: 'Tipo Doc', field: 'Tipo_Documento_Nombre' },

      { header: 'Genero', field: 'Genero_Nombre' },
      { header: 'Estado Civil', field: 'Estado_Civil_Nombre' },


      { header: 'Documento', field: 'Documento' , noNumeric: true },
      { header: 'Fecha', field: 'Fecha_Desembolso' , noNumeric: true  },
      { header: 'Capital', field: 'Prestamo' },
      { header: 'Estado', field: 'Estado_Deuda'}
    ];

  
    creditosData: any[] = [];
    filterClient: any[] = [];

    
    ngOnInit(): void {
      this.filterClient = [this.clientesColumns.find(col => col.field === 'Cliente')];
    }  

    constructor(private router: Router, private creditoDataService: CreditoService) {
      this.creditoDataService.getCreditosAndDataClient().subscribe(creditos => {
        this.creditosData = creditos.map(cliente => ({
          ...cliente,
          Estado_Deuda: cliente.Estado_Deuda === "0" ? "Vigente" : "Cancelado"
        }));
      }, error => {
        console.error('Error al obtener la data de creditos', error);
      });
    }
  
    onRowClick(event: { id: number }): void {
      const creditoSeleccionado = this.creditosData.find(credito => credito.ID === event.id);
      if (creditoSeleccionado) {
        this.router.navigate([`/creditos/consulta/consulta-credito/single-consulta-credito`, creditoSeleccionado.ID]);
      }
    }

}


