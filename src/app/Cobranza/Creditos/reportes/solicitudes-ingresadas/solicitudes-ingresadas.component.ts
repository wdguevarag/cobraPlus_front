import { Component } from '@angular/core';
import { SolicitudesIngresadasService } from 'src/app/Services/reportes-services/solicitudes-ingresadas.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-solicitudes-ingresadas',
  templateUrl: './solicitudes-ingresadas.component.html',
})
export class SolicitudesIngresadasComponent {

  
  solicitudesColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Fecha', field: 'Fecha_Registro' , noNumeric: true },
    { header: 'Oficina', field: 'Oficina_Nombre' },
    { header: 'Analista', field: 'Usuario_Nombre' },
    { header: 'Cliente', field: 'Cliente_Nombre' },
    { header: 'Monto', field: 'Prestamo' },
    { header: 'Cuotas', field: 'Nro_Cuotas' },
    { header: 'Monto Cuotas', field: 'Monto_Cuota' },
    { header: 'Estado', field: 'Estado_Aprobado' },

  ];

  solicitudesData: any[] = [];

  solicitudesFilters = [
    { field: 'Fecha_Registro_Sistema', type: 'date-start', title: 'Fecha Inicio' },
    { field: 'Fecha_Registro_Sistema', type: 'date-end', title: 'Fecha Fin' },
    { field: 'Oficina_Nombre', type: 'select', title: 'Oficina' },
    { field: 'Usuario_Nombre', type: 'select', title: 'Analista' },
  ];


  constructor( 
    private router: Router, 
    private http: HttpClient, 
    private solicitudesIngresadasService: SolicitudesIngresadasService) 
  { }

  ngOnInit(): void {
    this.solicitudesIngresadasService.getSolicitudesIngresadas().subscribe((ingresos) => {
      this.solicitudesData = ingresos;
    });
  }
}
