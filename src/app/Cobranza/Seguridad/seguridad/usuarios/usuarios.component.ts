import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { UsuarioService } from 'src/app/Services/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  currentUser: any ;

  constructor(
    private router: Router ,private usuarioService: UsuarioService ,
    private authService: AuthService,
  ) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.usuarioService.obtenerUsuarios().subscribe(
      response => {
        this.usuarioData = response
      },
      error => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }
  
   

   usuarioColumns = [
    { header: 'Cod. Usuario', field: 'ID' },
    
    // { header: 'Oficina', field: 'Usuario_Oficina_Nombre' },
    // { header: 'Empresa', field: 'Usuario_Empresa_Nombre' },

    { header: 'Nombre', field: 'Nombre' },

    { header: 'Apellido', field: 'Apellido' },
    { header: 'Nombre Corto', field: 'Nombre_Corto' },

    { header: 'Usuario', field: 'Email' },
    { header: 'DNI', field: 'DNI' , noNumeric: true },
    { header: 'Tel', field: 'Telefono', noNumeric: true},
    { header: 'Doc Anverso', field: 'Documento_Reverso' },
    { header: 'Doc Reverso', field: 'Documento_Anverso' },

    {header: 'Estado', field: 'Estado',   type: 'binario', trueValue: 'Activo', falseValue: 'Inactivo'}
  ];

  usuarioData: any[] = [];


  onRowClick(event: { id: number, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`/seguridad/seguridad/usuario/single-usuario`, event.id]);
  }

}



