import { Component, OnInit } from '@angular/core';
import { TransferenciaService } from '../../../../Services/transferencias.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrl: './transferencias.component.scss'
})
export class TransferenciasComponent implements OnInit {

    currentUser: any ;

  
    transferenciaColumns = [
      { header: 'Id', field: 'ID', show: false },
      { header: 'Credito', field: 'Credito_ID' },
      // { header: 'Fecha', field: 'Fecha_Registro_Credito' , noNumeric: true },
      { header: 'Fecha', field: 'Fecha_Registro_Sistema' , noNumeric: true },
      { header: 'Importe', field: 'Prestamo_Credito' },
      { header: 'Desembolso', field: 'ID_Desembolso' },
      { header: 'Tipo Desembolso', field: 'Tipo_Desembolso' },
      { header: 'Cliente', contentField: "Nombres_Cliente + ' ' + Apellido_Paterno_Cliente", show: true },
      { header: 'Firmado', field: 'Firmado_Desembolso',type: 'binario', trueValue: 'FIRMADO', falseValue: 'SIN FIRMAR' }
    ];
    
    transferenciaData: any[] = []
    
    constructor(
      private router: Router,
      private transferenciaService: TransferenciaService,
      private authService: AuthService
    ) {}

    ngOnInit(): void {

      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });

      this.transferenciaService.getTransferenciasClientesCreditos().subscribe(response => {
        this.transferenciaData = response.filter(transferencia => transferencia.Estado == '0'  && transferencia.Estado_Aprobado_Desembolso == '1' );
      }, error => {
        console.error('Error al obtener las Transferencias', error);
      });

    }



    
    onRowClick(event: { id: number, tableName?: string }): void {
      console.log('Fila seleccionada con id:', event.id);
      this.router.navigate([`/creditos/operacion/transferencia/single-transferencia`, event.id]);
    }
}
