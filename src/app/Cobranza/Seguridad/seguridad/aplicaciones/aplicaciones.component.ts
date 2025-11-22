import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';

@Component({
  selector: 'app-aplicaciones',
  templateUrl: './aplicaciones.component.html',
  styleUrl: './aplicaciones.component.scss'
})
export class AplicacionesComponent implements OnInit {

  aplicacionColumns: any[] = [
    // { header: 'Asignar', contentField: 'asignar', type: 'button' },
    { header: 'Codigo', field: 'ID' , show: true },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Ruta', field: 'Ruta' },
    { header: 'Icono', field: 'Icono' },
    { header: 'Descripción', field: 'Descripcion' },
    {header: 'Estado', field: 'Estado',   type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO'}
  ];
  
  aplicacionData: any[] = [];

  constructor(
    private router: Router ,
    private aplicacionService: AplicacionService 
  ) { }

  ngOnInit(): void {
    this.aplicacionService.getAplicaciones().subscribe(response => {
      this.aplicacionData = response;
    }, error => {
      console.error('Error al obtener las Empresas', error);
    });
  }
  
  onRowClick(event: { id: number, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`/seguridad/seguridad/aplicacion/single-aplicacion`, event.id]);
  }

  onButtonAction(event: { contentField: string, id: number }): void {
    console.log(`Acción en botón: columna=${event.contentField}, fila=${event.id}`);
    if (event.contentField === 'asignar') {
      this.router.navigate([`/seguridad/seguridad/aplicacion/asignar-roles-aplicacion/`, event.id]); 
    }
  }
 
}
