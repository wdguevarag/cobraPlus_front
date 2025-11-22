import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject , Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyeccionDesembolsoService {
  private proyeccionDesembolsos = new BehaviorSubject<any[]>([
    {
        id: 1,
        cliente: 'Rocio del Pilar 1',
        tipoCliente: 'Recurrente',
        fechaProyeccion: '10/01/25',
        horaProyeccion: '2:00pm',
        tipoFirma: 'OFICINA' ,
        tipoDesembolso: 'TRANSFERENCIA',
        monto: '500.00',
        cuotas: '20',
        usuario: 'GUERREROX',
        estado: "activo",
      },
      {
        id: 2,
        cliente: 'Juan Pérez',
        tipoCliente: 'Nuevo',
        fechaProyeccion: '15/02/25',
        horaProyeccion: '10:30am',
        tipoFirma: 'DIGITAL',
        tipoDesembolso: 'EFECTIVO',
        monto: '1200.50',
        cuotas: '12',
        usuario: 'JUAN123',
        estado: 'pendiente',
      },
      {
        id: 3,
        cliente: 'María López',
        tipoCliente: 'Recurrente',
        fechaProyeccion: '05/03/25',
        horaProyeccion: '4:45pm',
        tipoFirma: 'OFICINA',
        tipoDesembolso: 'CHEQUE',
        monto: '750.75',
        cuotas: '24',
        usuario: 'MARIALOPEZ',
        estado: 'finalizado',
      }

  ]);

  getProyeccionDesembolsos() {
    return this.proyeccionDesembolsos.asObservable();
  }

  getProyeccionDesembolsoById(id: number) {
    return this.proyeccionDesembolsos.value.find(pd => pd.id === id);
  }
}