import { Component } from '@angular/core';
import { NotificacionService } from 'src/app/Services/reportes-services/notificacion.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
})
export class NotificacionComponent {

  filters = [
    { id: '1', label: 'Fecha Inicio', type: 'date' },
    { id: '2', label: 'Fecha Fin', type: 'date' },
    { id: '3', label: 'Oficina', type: 'select', options: [{ value: '1', label: 'Oficina A' }, { value: '2', label: 'Oficina B' }] },
    { id: '4', label: 'Analista', type: 'select', options: [{ value: '1', label: 'Carlos García' }, { value: '2', label: 'Ana Ruiz' }] },
    { id: '5', label: 'Tipo Paquete', type: 'select', options: [{ value: '1', label: 'A' }, { value: '2', label: 'B' }] }

  ];

  notificacionesColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Fecha', field: 'Fecha' , noNumeric: true },
    { header: 'Título', field: 'Titulo' },
    { header: 'Contenido', field: 'Contenido' },
    { header: 'Paquete', field: 'Paquete' },
    { header: 'Oficina', field: 'Distrito' },
    { header: 'Usuario', field: 'Nombre' }
  ];

  notificacionesData: any[] = [];

  constructor( private router: Router, private http: HttpClient, private notificacionService: NotificacionService) {
    this.notificacionService.getNotificaciones().subscribe(response => {
      this.notificacionesData = response;
    }, error => {
      console.error('Error al obtener las notificaciones', error);
    });
  }

  ngOnInit(): void {
    this.notificacionService.getNotificaciones().subscribe((data) => {
      this.notificacionesData = data;
    });
  }

}
