import { Component } from '@angular/core';
import { CarteraService } from 'src/app/Services/reportes-services/cartera.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cartera',
  templateUrl: './cartera.component.html',
})
export class CarteraComponent {

  carteraColumns = [
    { header: 'Codigo', field: 'ID', show: false },
    { header: 'Asesor', field: 'Asesor_Nombre' , totalLabel: 'Total'},
    
    { header: 'N. Cliente Total', field: 'Num_Clientes' , sumable: true },
    { header: 'Saldo K. Total', field: 'Clientes_Saldo_Capital_Total' , sumable: true },


    { header: 'N. Cliente M <= 0', field: 'Num_Clientes_m0' , sumable: true},
    { header: 'Saldo K. M <= 0', field: 'Clientes_Saldo_Capital_Total_m0' , sumable: true },

    { header: 'N. Cliente M = 1', field: 'Num_Clientes_m1' , sumable: true },
    { header: 'Saldo K. M = 1', field: 'Clientes_Saldo_Capital_Total_m1' , sumable: true},

    { header: 'N. Cliente  M = 2', field: 'Num_Clientes_m2' , sumable: true },
    { header: 'Saldo K.  M = 2', field: 'Clientes_Saldo_Capital_Total_m2', sumable: true },


    { header: 'N. Cliente  M 3 ... 7', field: 'Num_Clientes_m3' , sumable: true},
    { header: 'Saldo K.  M 3 ... 7', field: 'Clientes_Saldo_Capital_Total_m3' , sumable: true},

    { header: 'N. Cliente  M <= 8', field: 'Num_Clientes_m8' , sumable: true},
    { header: 'Saldo K.  M <= 8', field: 'Clientes_Saldo_Capital_Total_m8' , sumable: true},


    { header: '% Mora 3', field: 'Por_Clientes_Mora_3', noNumeric: true },
    { header: '% Mora 8', field: 'Por_Clientes_Mora_8', noNumeric: true },
    { header: 'Tasa Pond', field: 'Tasa_Pon' , sumable: true},


  ];


  carteraData: any[] = [];


  carteraFilters = [
    { field: 'Num_Clientes', type: 'select', title: 'Numero de Clientes' },
  ];

  constructor(
    private router: Router,
    private carteraService: CarteraService
  ) {}

  ngOnInit(): void {
    this.carteraService.getCartera().subscribe((carteras) => {
      this.carteraData = carteras;
    });
  }
}
