import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProyeccionDesembolsoService } from '../../../../Services/proyeccion-desembolso.service';

@Component({
  selector: 'app-proyeccion-desembolso',
  templateUrl: './proyeccion-desembolso.component.html',
  styleUrl: './proyeccion-desembolso.component.scss'
})
export class ProyeccionDesembolsoComponent {

  proyeccionDesembolsoColumns = [
    { header: 'Codigo', field: 'id', show: true },
    { header: 'Cliente', field: 'cliente'},
    { header: 'Tipo Cliente', field: 'tipoCliente'},
    { header: 'Fecha Proyeccion', field: 'fechaProyeccion' , noNumeric: true},
    { header: 'Hora Proyeccion', field: 'horaProyeccion'},
    { header: 'Tipo Firma', field: 'tipoFirma'},
    { header: 'Tipo Desembolso', field: 'tipoDesembolso'},
    { header: 'Monto', field: 'monto' },
    { header: 'Cuotas', field: 'cuotas' },
    { header: 'Usuario', field: 'usuario' },
    { header: 'Estado', field: 'estado' }
  ];

  proyeccionDesembolsoData: any[] = [];

  constructor(private router: Router, private proyeccionDesembolsoService: ProyeccionDesembolsoService) {
    this.proyeccionDesembolsoService.getProyeccionDesembolsos().subscribe(proyeccionDesembolsos => {
      this.proyeccionDesembolsoData = proyeccionDesembolsos;
    });
  }


}













