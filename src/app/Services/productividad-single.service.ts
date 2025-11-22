import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductividadSingleService {
  private productividadData = new BehaviorSubject<any[]>([
    {
      id: 1,
      numeroCuota: 1,
      numeroDias: 30,
      diaAcumulado: 15,
      fecha: "2025-01-25",
      capital: 1000,
      interes: 50,
      igv: 9,
      gastoAdministrativo: 10,
      cuota: 1069,
      saldo: 500
    },
    {
      id: 2,
      numeroCuota: 2,
      numeroDias: 30,
      diaAcumulado: 29,
      fecha: "2025-02-25",
      capital: 950,
      interes: 45,
      igv: 8.55,
      gastoAdministrativo: 9,
      cuota: 1012.55,
      saldo: 450
    },
    {
      id: 3,
      numeroCuota: 3,
      numeroDias: 30,
      diaAcumulado: 30,
      fecha: "2025-03-25",
      capital: 900,
      interes: 40,
      igv: 7.6,
      gastoAdministrativo: 8,
      cuota: 955.6,
      saldo: 400
    }
  ]);

  constructor() {}

  getProductividadData() {
    return this.productividadData.asObservable();
  }
}
