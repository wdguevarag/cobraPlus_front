import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';


@Component({
  selector: 'app-grupo-de-datos',
  templateUrl: './grupo-de-datos.component.html',
  styleUrl: './grupo-de-datos.component.scss'
})
export class GrupoDeDatosComponent {

  constructor(private router: Router, private http: HttpClient ,private grupoDatosService: GrupoDeDatoService ) {
    this.grupoDatosService.getGrupoDatos().subscribe(response => {
      this.grupoDeDatosData = response;
    }, error => {
      console.error('Error al obtener las oficinas', error);
    });
   }

    grupoDeDatosColumns: any[] = [
      { header: 'Codigo', field: 'ID' , show: true },
      { header: 'Nombre', field: 'Nombre'},
      { header: 'Descripcion', field: 'Descripcion' },
      { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'Activo', falseValue: 'Inactivo' }
    ];

    grupoDeDatosData: any[] = [];




    onRowClick(event: { id: number, tableName?: string }): void {
      console.log('Fila seleccionada con id:', event.id);
      this.router.navigate([`/creditos/parametro/grupo-de-dato/single-grupo-dato`, event.id]);
    }

}

