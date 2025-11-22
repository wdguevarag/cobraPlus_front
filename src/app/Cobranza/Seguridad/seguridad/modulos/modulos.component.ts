import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs'; // Para hacer las dos solicitudes en paralelo
import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { ModuloService } from 'src/app/Services/modulo.service';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrl: './modulos.component.scss'
})
export class ModulosComponent implements OnInit {

  moduloColumns = [
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Nombre', field: 'Nombre' },
    { 
      header: 'Aplicacion', 
      field: 'NombreAplicacion' 
    },
    { header: 'Descripcion', field: 'Descripcion' },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'Activo', falseValue: 'Inactivo' }
  ];

  moduloData: any[] = [];

  constructor(
    private router: Router,
    private moduloService: ModuloService,
    public aplicacionService: AplicacionService
  ) { }

  ngOnInit(): void {
    this.cargarDataCompleta();
  }

  cargarDataCompleta(): void {
    forkJoin({
      modulos: this.moduloService.getModulos(),
      aplicaciones: this.aplicacionService.getAplicaciones()
    }).subscribe(
      ({ modulos, aplicaciones }) => {
        modulos.forEach((modulo) => {
          const aplicacion = aplicaciones.find((app) => app.ID === modulo.Aplicacion_ID);
          modulo.NombreAplicacion = aplicacion ? aplicacion.Nombre : 'Desconocido';
        });
        this.moduloData = modulos;
      },
      (error) => {
        console.error('Error al cargar los datos', error);
      }
    );
  }

  onRowClick(event: { id: number, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`/seguridad/seguridad/modulo/single-modulo`, event.id]);
  }
}