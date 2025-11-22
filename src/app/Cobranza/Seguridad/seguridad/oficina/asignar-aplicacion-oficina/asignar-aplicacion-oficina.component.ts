import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OficinaService } from '../../../../../Services/oficina.service';

@Component({
  selector: 'app-asignar-aplicacion-oficina',
  templateUrl: './asignar-aplicacion-oficina.component.html',
  styleUrls: ['./asignar-aplicacion-oficina.component.scss'],
})
export class AsignarAplicacionOficinaComponent implements OnInit {
  AppPorAsignarColumns: any[] = [
    { header: 'Asignar', type: 'btn-toggle', field: 'Aplicacion_Oficina_Estado' },
    { header: 'Codigo Relacional', field: 'Aplicacion_Oficina_ID', fieldToggleId: true , show: false},
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Ruta', field: 'Ruta' },
    { header: 'Icono', field: 'Icono' },
    { header: 'Descripcion', field: 'Descripcion' },
    { header: 'Estado Asignación', field: 'Aplicacion_Oficina_Estado', type: 'binario', trueValue: 'Activo', falseValue: 'Inactivo' }
  ];
  

  AppPorAsignarData: any[] = [];
  singleOficinaId: number | null = null;
  singleOficinaData: any;
  isLoading: boolean = true; 

  constructor(
    private route: ActivatedRoute,
    private oficinaService: OficinaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.singleOficinaId = idParam ? +idParam : null;
      if (this.singleOficinaId) {
        this.oficinaService.getOficinaById(this.singleOficinaId).subscribe(
          (data) => {
            this.singleOficinaData = data;
            this.isLoading = false;
            console.log('Datos de oficina:', this.singleOficinaData);
          },
          (error) => {
            console.error('Error al obtener la oficina:', error);
            this.isLoading = false;
          }
        );

        this.oficinaService.getAplicacionesByOficina(this.singleOficinaId).subscribe(
          (data) => {
            this.AppPorAsignarData = data;
            console.log('Datos de aplicaciones disponibles:', this.AppPorAsignarData);
          },
          (error) => {
            console.error('Error al obtener las aplicaciones disponibles:', error);
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  handleToggleChange(event: { field: string, id: number, value: number }): void {
    const row = this.AppPorAsignarData.find(item => item.Aplicacion_Oficina_ID === event.id);
    if (row) {
      row.isUpdating = true; // Marcar la fila como en proceso de actualización
    }
    const formData = {
      ID: event.id,       // Identificador de la aplicación
      Estado: event.value // Nuevo estado (1 o 0)
    };
    this.oficinaService.editAppStatus(formData).subscribe(
      response => {
        console.log('Estado actualizado correctamente:', response);
        if (row) {
          row.isUpdating = false; // Finalizar el estado de actualización
        }
      },
      error => {
        console.error('Error actualizando el estado de la aplicación:', error);
        if (row) {
          row.isUpdating = false;
        }
      }
    );
  }


}
