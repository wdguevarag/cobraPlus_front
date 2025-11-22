import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';

@Component({
  selector: 'app-asignar-roles-aplicacion',
  templateUrl: './asignar-roles-aplicacion.component.html',
  styleUrl: './asignar-roles-aplicacion.component.scss'
})
export class AsignarRolesAplicacionComponent implements OnInit{
  RolesPorAsignarColumns = [
    { header: 'Asignar', type: 'btn-toggle', field: 'Aplicacion_Rol_Estado' },
    { header: 'Codigo Relacional', field: 'Aplicacion_Rol_ID', fieldToggleId: true , show: false},
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Nombre', field: 'Nombre'},
    { header: 'Descripcion', field: 'Descripcion' },
    { header: 'Estado Asignación', field: 'Aplicacion_Rol_Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];
  RolesPorAsignarData: any[] = [];

  
  singleAplicacionId: number | null = null;
  singleAplicacionData: any;

  isLoading: boolean = true; 

  opciones_aplicaciones: string[] = ['Los Olivos', 'San Martin', 'Lima'];


  constructor(
    private route: ActivatedRoute, 
    private aplicacionService: AplicacionService
  ) {}




  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.singleAplicacionId = idParam ? +idParam : null;
      if (this.singleAplicacionId) {
        this.aplicacionService.getAplicacionById(this.singleAplicacionId).subscribe(
          (data) => {
            this.singleAplicacionData = data;
            this.isLoading = false;
            console.log('Datos de la Aplicacion:', this.singleAplicacionData);
          },
          (error) => {
            console.error('Error al obtener la Aplicacion:', error);
            this.isLoading = false;
          }
        );

        this.aplicacionService.getRolesByAplicacion(this.singleAplicacionId).subscribe(
          (data) => {
            this.RolesPorAsignarData = data;
            console.log('Datos de aplicaciones disponibles:', this.RolesPorAsignarData);
          },
          (error) => {
            console.error('Error al obtener los roles disponibles:', error);
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  handleToggleChange(event: { field: string, id: number, value: number }): void {
    const row = this.RolesPorAsignarData.find(item => item.Aplicacion_Rol_ID === event.id);
    if (row) {
      row.isUpdating = true; 
    }
    const formData = {
      ID: event.id,       
      Estado: event.value 
    };
    this.aplicacionService.editRolesStatus(formData).subscribe(
      response => {
        console.log('Estado actualizado correctamente:', response);
        if (row) {
          row.isUpdating = false; 
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








