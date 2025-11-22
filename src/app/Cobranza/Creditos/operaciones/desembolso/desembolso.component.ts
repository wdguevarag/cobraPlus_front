import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { DesembolsoService } from 'src/app/Services/desembolso.service';

@Component({
  selector: 'app-desembolso',
  templateUrl: './desembolso.component.html',
  styleUrl: './desembolso.component.scss'
})
export class DesembolsoComponent {

  currentUser: any ;

  
  desembolsoColumns = [
    { header: 'ID', field: 'ID', show: true },
    { header: 'Credito ID', field: 'Credito_ID' },
    { header: 'Tipo Credito', field: 'Tipo_Credito' },
    // { header: 'Fecha', field: 'Fecha_Registro_Credito' , noNumeric: true  },

    { header: 'Fecha', field: 'Fecha_Registro_Sistema' , noNumeric: true  },

    { header: 'Importe', field: 'Prestamo_Credito' },
    { header: 'Cliente', contentField: "Nombres_Cliente + ' ' + Apellido_Paterno_Cliente", show: true },
    { header: 'Firmado', field: 'Firmado' ,type: 'binario', trueValue: 'FIRMADO', falseValue: 'SIN FIRMAR' },
    // { header: 'Estado Credito', field: 'Estado_Credito'  },
    // { header: 'Desembolsador ID', field: 'Desembolsador_ID'  },
    { header: 'Estado', field: 'Estado_Aprobado' ,type: 'binario', trueValue: 'APROBADO', falseValue: 'PENDIENTE' },
  ];
  
  desembolsoData: any[] = []
  
  constructor(
    private router: Router,
    private desembolsoService: DesembolsoService,
    private authService: AuthService
  ) {}



    
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.desembolsoService.getDesembolsosClientesCreditos().subscribe(
      response => {
        this.desembolsoData = response.filter(Desembolso =>  Desembolso.Estado == '0' && Desembolso.Tipo_Credito !== 'Refinanciacion')
      },
      error => {
        console.error('Error al obtener los Desembolsos', error);
      }
    );
  }



  
  onRowClick(event: { id: number, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`/creditos/operacion/desembolso/single-desembolso`, event.id]);
  }

  
}
