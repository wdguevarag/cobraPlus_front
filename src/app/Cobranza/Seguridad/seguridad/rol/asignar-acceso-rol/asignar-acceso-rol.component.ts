import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RolService } from '../../../../../Services/rol.service';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { ModuloService } from 'src/app/Services/modulo.service';
import { forkJoin } from 'rxjs'; // Para hacer las solicitudes en paralelo
import { AccesoService } from 'src/app/Services/acesso.service';

@Component({
  selector: 'app-asignar-acceso-rol',
  templateUrl: './asignar-acceso-rol.component.html',
  styleUrls: ['./asignar-acceso-rol.component.scss']
})
export class AsignarAccesoRolComponent implements OnInit {

  accesosPorAsignarColumns: any[] = [

    { header: 'Asignar', type: 'btn-toggle', field: 'Estado_Rol_Acceso', trueValue: 1, falseValue: 0 },
    { header: 'Codigo', field: 'Acceso_ID', show: true , fieldToggleId: true},
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Aplicacion', field: 'Acceso_Aplicacion_Nombre' },
    { header: 'Modulo', field: 'Acceso_Modulo_Nombre' },
    // { header: 'Aplicacion', field: 'Acceso_Aplicacion_ID' },
    // { header: 'Modulo', field: 'Acceso_Modulo_ID' },

    { header: 'Nombre', field: 'Acceso_Nombre' },
    { header: 'Ruta', field: 'Acceso_Ruta' },
    { header: 'Icono', field: 'Acceso_Icono' },
    { header: 'Descripcion', field: 'Acceso_Descripcion' },
    { header: 'Estado', field: 'Estado_Rol_Acceso', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  accesosPorAsignarData: any[] = [];

  accesosPorAsignarFilters = [
    { field: 'Acceso_Aplicacion_Nombre', type: 'select', title: 'Apliacion' },
    { field: 'Acceso_Modulo_Nombre', type: 'select', title: 'Modulo' },
  ];


  

  singleRolId: number | null = null;
  singleRolData: any;

  constructor(
    public moduloService: ModuloService,
    public aplicacionService: AplicacionService,
    public accesoService: AccesoService,
    private route: ActivatedRoute,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    // Obtenemos el ID del rol desde la ruta
    this.route.paramMap.subscribe((params) => {
      this.singleRolId = +params.get('id')!;
      if (this.singleRolId) {

        this.rolService.getAccesosByRolId(this.singleRolId).subscribe(
          (data) => {
            this.accesosPorAsignarData = data;
          },
          (error) => {
            console.error('Error al obtener las usuarios asignados:', error);
          }
        ) ;

        this.rolService.getRolById(this.singleRolId).subscribe(
          (data) => {
            this.singleRolData = data;
            
          },
          (error) => {
            console.error('Error al obtener el Acceso:', error);
          }
        );

      }
    });
  }


  handleToggleChange(event: { field: string, id: number, value: number }): void {
    // Buscamos el objeto acceso correspondiente en la data cargada
    const accesoSeleccionado = this.accesosPorAsignarData.find(acceso => acceso.Acceso_ID == event.id);
    if (!accesoSeleccionado) return;
  
    if (event.value == 1) {
      // Si el toggle se activa, agregamos el acceso.
      this.rolService.agregarAcceso(this.singleRolId, {
        Acceso_ID: accesoSeleccionado.Acceso_ID,
        Modulo_ID: accesoSeleccionado.Acceso_Modulo_ID,
        Aplicacion_ID: accesoSeleccionado.Acceso_Aplicacion_ID
      }).subscribe(response => {
        console.log('Acceso agregado exitosamente:', response);
        // Actualiza singleRolData o notifica al usuario si es necesario.
      }, error => {
        console.error('Error al agregar acceso:', error);
      });
    } else {
      // Si se desactiva, removemos el acceso.
      this.rolService.removerAcceso(this.singleRolId, accesoSeleccionado.Acceso_ID).subscribe(response => {
        console.log('Acceso removido exitosamente:', response);
        // Actualiza singleRolData o notifica al usuario si es necesario.
      }, error => {
        console.error('Error al remover acceso:', error);
      });
    }
  }
  


}
