import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolService } from '../../../../Services/rol.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss'],
})
export class RolComponent implements OnInit {
  currentUser: any;
  rolData: any[] = [];

  rolColumnsSuperAdmin: any[] = [
    { header: 'Asignar', contentField: 'Acceso', type: 'button' },
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Empresa', field: 'Empresa_ID' },
    { header: 'Perfil', field: 'Perfil_ID' },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Descripcion', field: 'Descripcion' },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  rolColumnsAdminEmpresa: any[] = [
    { header: 'Asignar', contentField: 'Acceso', type: 'button' },
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Descripcion', field: 'Descripcion' },
    { header: 'Fecha', field: 'Fecha_Registro', noNumeric: true },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  constructor(
    private router: Router,
    private rolService: RolService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        filter(user => !!user),
        switchMap(user => {
          this.currentUser = user;
          console.log('DEBUG: user in component', this.currentUser);
          return this.rolService.getRoles();
        })
      )
      .subscribe(
        response => {
          console.log('DEBUG: roles response', response);

          // Usar Rol_ID del usuario para controlar vist
          const userRol = Number(this.currentUser.Rol_ID);
          const userEmpresa = Number(this.currentUser.Empresa_ID);

          if (userRol !== 1) {
            // Admin empresa: solo roles Perfil_ID=3 y misma Empresa_ID
            this.rolData = response.filter((rol: any) =>
              Number(rol.Perfil_ID) === 3 && Number(rol.Empresa_ID) === userEmpresa
            );
          } else {
            // SuperAdmin: muestra todos los roles
            this.rolData = response;
          }

          console.log('DEBUG: filtered rolData', this.rolData);
        },
        error => {
          console.error('Error al obtener roles:', error);
          this.rolData = [];
        }
      );
  }

  onRowClick(event: { id: number; tableName?: string }): void {
    console.log('DEBUG: row click id', event.id);
    this.router.navigate([`/seguridad/seguridad/rol/single-rol`, event.id]);
  }

  onButtonAction(event: { contentField: string; id: number }): void {
    console.log('DEBUG: button action id', event.id);
    this.router.navigate([`/seguridad/seguridad/rol/asignar-acceso-rol`, event.id]);
  }
}