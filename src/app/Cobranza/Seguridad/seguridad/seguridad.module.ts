import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { SeguridadComponent } from './seguridad.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MenuSeguridadComponent } from './menu-seguridad/menu-seguridad.component';

//imports Oficina
import { OficinaComponent } from './oficina/oficina.component';
import { SingleOficinaComponent } from './oficina/single-oficina/single-oficina.component';
import { AsignarAplicacionOficinaComponent } from './oficina/asignar-aplicacion-oficina/asignar-aplicacion-oficina.component';
import { NuevaOficinaComponent } from './oficina/nueva-oficina/nueva-oficina.component';

//imports Rol
import { RolComponent } from './rol/rol.component';
import { NuevoRolComponent } from './rol/nuevo-rol/nuevo-rol.component';
import { SingleRolComponent } from './rol/single-rol/single-rol.component';
import { AsignarAccesoRolComponent } from './rol/asignar-acceso-rol/asignar-acceso-rol.component';

//imports Usuarios
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SingleUsuarioComponent } from './usuarios/single-usuario/single-usuario.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario/nuevo-usuario.component';
import { NuevoDocumentoComponent } from './usuarios/single-usuario/nuevo-documento/nuevo-documento.component';



//imports Modulos
import { ModulosComponent } from './modulos/modulos.component';
import { SingleModuloComponent } from './modulos/single-modulo/single-modulo.component';
import { NuevoModuloComponent } from './modulos/nuevo-modulo/nuevo-modulo.component';

//imports Empresa
import { EmpresasComponent } from './empresas/empresas.component';
import { SingleEmpresaComponent } from './empresas/single-empresa/single-empresa.component';
import { NuevaEmpresaComponent } from './empresas/nueva-empresa/nueva-empresa.component';
import { NuevoUsuarioEmpresaComponent } from './empresas/nuevo-usuario-empresa/nuevo-usuario-empresa.component';


//imports Accesos
import { AccesosComponent } from './accesos/accesos.component';
import { SingleAccesoComponent } from './accesos/single-acceso/single-acceso.component';
import { NuevoAccesoComponent } from './accesos/nuevo-acceso/nuevo-acceso.component';


//imports Aplicaciones
import { AplicacionesComponent } from './aplicaciones/aplicaciones.component';
import { NuevaAplicacionComponent } from './aplicaciones/nueva-aplicacion/nueva-aplicacion.component';
import { SingleAplicacionComponent } from './aplicaciones/single-aplicacion/single-aplicacion.component';
import { AsignarRolesAplicacionComponent } from './aplicaciones/asignar-roles-aplicacion/asignar-roles-aplicacion.component';
import { AuthService } from 'src/app/Services/Common/Auth.service';



@NgModule({
  declarations: [
    SeguridadComponent,
    MenuSeguridadComponent,
    OficinaComponent,
    SingleOficinaComponent,
    AsignarAplicacionOficinaComponent,
    NuevaOficinaComponent,
    RolComponent,
    SingleRolComponent,
    NuevoRolComponent,
    AsignarAccesoRolComponent,
    UsuariosComponent,
    SingleUsuarioComponent,
    NuevoDocumentoComponent,
    NuevoUsuarioComponent,
    ModulosComponent,
    SingleModuloComponent,
    NuevoModuloComponent,
    EmpresasComponent,
    SingleEmpresaComponent,
    NuevaEmpresaComponent,
    AccesosComponent,
    SingleAccesoComponent,
    NuevoAccesoComponent,
    AplicacionesComponent,
    NuevaAplicacionComponent,
    AsignarRolesAplicacionComponent,
    SingleAplicacionComponent,
    NuevoUsuarioEmpresaComponent,
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule , 
    SharedModule,
  ],
  exports: [
    MenuSeguridadComponent,
  ],
})
export class SeguridadModule { }
