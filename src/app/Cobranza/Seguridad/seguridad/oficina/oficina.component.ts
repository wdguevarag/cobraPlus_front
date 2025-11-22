import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OficinaService } from '../../../../Services/oficina.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-oficina',
  templateUrl: './oficina.component.html',
  styleUrls: ['./oficina.component.scss'],
})

export class OficinaComponent implements OnInit {

  oficinaColumns: any[] = [
    {header: 'Codigo', field: 'ID' , show: true },
    // {header: 'Asignar',  contentField: 'Asignar', type: 'button' },
    // {header: 'Empresa' , field: 'Nombre_Empresa'  },
    {header: 'Nombre' , field: 'Nombre', },
    {header: 'Descripcion' , field: 'Descripcion', },
    {header: 'Ubicacion' , field: 'Ubicacion' },
    {header: 'Estado', field: 'Estado',   type: 'binario', trueValue: 'Activo', falseValue: 'Inactivo'}
  ];
  
  oficinaData: any[] = [];

  currentUser: any ;

  constructor(
    private router: Router ,
    private oficinaService: OficinaService,
    private authService: AuthService
  ){}



  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.oficinaService.getOficinas().subscribe(
      response => {
        this.oficinaData = response
      },
      error => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }
  




  
  onButtonAction(event: { contentField: string, id: number }): void {
    console.log(`Acción en botón: columna=${event.contentField}, fila=${event.id}`);
    if (event.contentField === 'Asignar') {
      this.router.navigate([`/seguridad/seguridad/oficina/asignar-aplicacion-oficina`, event.id]);
    }
   }

  onRowClick(event: { id: number, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`/seguridad/seguridad/oficina/single-oficina`, event.id]);
  }

}
