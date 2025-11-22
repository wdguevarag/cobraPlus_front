import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoCancelacionIndividualService {
  private cancelacionesIndividuales = new BehaviorSubject<any[]>([
    {
      id: 'TOTALES',
      atraso: '',
      total: 0,
      capital: 0,
      interes: 0,
      comision: 0,
      igv: 0,
      mora: 0,
      usuario: 'N. CORTES'
    },
    {
      id: 'TOTALES',
      atraso: '',
      total: 0,
      capital: 0,
      interes: 0,
      comision: 0,
      igv: 0,
      mora: 0,
      usuario: 'N. CORTES'
    },
    {
      id: 'TOTALES',
      atraso: '',
      total: 0,
      capital: 0,
      interes: 0,
      comision: 0,
      igv: 0,
      mora: 0,
      usuario: 'N. CORTES'
    }
  ]);

  getCancelacionesIndividuales() {
    return this.cancelacionesIndividuales.asObservable();
  }

  getCancelacionIndividualById(id: number) {
    return this.cancelacionesIndividuales.value.find(p => p.id === id);
  }
}
