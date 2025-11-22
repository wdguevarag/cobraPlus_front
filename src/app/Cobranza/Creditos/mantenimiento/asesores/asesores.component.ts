import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../Services/usuario.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-asesores',
  templateUrl: './asesores.component.html',
  styleUrl: './asesores.component.scss'
})
export class AsesoresComponent implements OnInit {

    currentUser: any ;

    asesoresColumns = [
      { header: 'Codigo', field: 'ID', show: true },
      { header: 'DNI', field: 'DNI' , noNumeric: true},
      { header: 'Apellido', field: 'Apellido' },
      // { header: 'Perfil_ID', field: 'Perfil_ID' },

      { header: 'Nombres', field: 'Nombre'},
      { header: 'Estado', field: 'Estado',type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
    ];
  
    asesoresData: any[] = [];
  
    constructor(
      private router: Router, 
      private usuarioService: UsuarioService,
      private authService: AuthService
    ) {  }
    
    ngOnInit(): void {
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
      this.usuarioService.getUsuariosAsesores().subscribe(response => {
        this.asesoresData = response 
        console.log(this.asesoresData)
      }, error => {
        console.error('Error al obtener los asesores', error);
      });
    }

    onRowClick(event: { id: number, tableName?: string }): void {
      console.log('Fila seleccionada con id:', event.id);
      this.router.navigate([`/creditos/mantenimiento/asesor/single-asesor`, event.id]);
    }

    plusShowCuentas() {
      console.log('Función personalizada ejecutada a través del evento plusShowEvent');
    }

}




