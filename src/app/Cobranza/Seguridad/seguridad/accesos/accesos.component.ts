import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs'; // Para hacer las solicitudes en paralelo
import { AccesoService } from 'src/app/Services/acesso.service';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { ModuloService } from 'src/app/Services/modulo.service';

@Component({
  selector: 'app-accesos',
  templateUrl: './accesos.component.html',
  styleUrl: './accesos.component.scss'
})
export class AccesosComponent implements OnInit {

  accesoColumns = [
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Aplicación', field: 'NombreAplicacion' },
    { header: 'Módulo', field: 'NombreModulo' },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Ruta', field: 'Ruta' },
    { header: 'Descripcion', field: 'Descripcion' },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' },
  ];

  accesoData: any[] = [];

  constructor(
    private router: Router,
    private accesoService: AccesoService,
    public moduloService: ModuloService,
    public aplicacionService: AplicacionService
  ) { }

  ngOnInit(): void {
    this.cargarDataCompleta();
  }

  cargarDataCompleta(): void {
    // Paso 1: Hacer todas las solicitudes en paralelo
    forkJoin({
      accesos: this.accesoService.getAccesos(),
      aplicaciones: this.aplicacionService.getAplicaciones(),
      modulos: this.moduloService.getModulos()
    }).subscribe(
      ({ accesos, aplicaciones, modulos }) => {
        // Paso 2: Mapear los nombres de las aplicaciones y módulos a los accesos
        accesos.forEach((acceso) => {
          // Buscar la aplicación correspondiente
          const aplicacion = aplicaciones.find((app) => app.ID === acceso.Aplicacion_ID);
          acceso.NombreAplicacion = aplicacion ? aplicacion.Nombre : 'Desconocido';

          // Buscar el módulo correspondiente
          const modulo = modulos.find((mod) => mod.ID === acceso.Modulo_ID);
          acceso.NombreModulo = modulo ? modulo.Nombre : 'Desconocido';
        });

        // Paso 3: Asignar los accesos con los nombres de aplicaciones y módulos a accesoData
        this.accesoData = accesos;
      },
      (error) => {
        console.error('Error al cargar los datos', error);
      }
    );
  }

  onRowClick(event: { id: number, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`/seguridad/seguridad/acceso/single-acceso`, event.id]);
  }
}
