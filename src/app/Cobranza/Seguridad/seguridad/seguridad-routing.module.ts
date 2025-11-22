import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuSeguridadComponent } from './menu-seguridad/menu-seguridad.component';

/*Oficina  Imports*/
import { OficinaComponent } from './oficina/oficina.component';
import { NuevaOficinaComponent } from './oficina/nueva-oficina/nueva-oficina.component';
import { AsignarAplicacionOficinaComponent } from './oficina/asignar-aplicacion-oficina/asignar-aplicacion-oficina.component';
import { SingleOficinaComponent } from './oficina/single-oficina/single-oficina.component';


/*Rol  Imports*/
import { RolComponent } from './rol/rol.component';
import { NuevoRolComponent } from './rol/nuevo-rol/nuevo-rol.component';
import { SingleRolComponent } from './rol/single-rol/single-rol.component';
import { AsignarAccesoRolComponent } from './rol/asignar-acceso-rol/asignar-acceso-rol.component';


/*Usuario  Imports*/
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario/nuevo-usuario.component';
import { SingleUsuarioComponent } from './usuarios/single-usuario/single-usuario.component';
import { NuevoDocumentoComponent } from './usuarios/single-usuario/nuevo-documento/nuevo-documento.component';



/*Aplicaciones  Imports*/
import { AplicacionesComponent } from './aplicaciones/aplicaciones.component';
import { NuevaAplicacionComponent } from './aplicaciones/nueva-aplicacion/nueva-aplicacion.component';
import { SingleAplicacionComponent } from './aplicaciones/single-aplicacion/single-aplicacion.component';
import { AsignarRolesAplicacionComponent } from './aplicaciones/asignar-roles-aplicacion/asignar-roles-aplicacion.component';


/* Accesos  Imports*/
import { AccesosComponent } from './accesos/accesos.component';
import { NuevoAccesoComponent } from './accesos/nuevo-acceso/nuevo-acceso.component';
import { SingleAccesoComponent } from './accesos/single-acceso/single-acceso.component';

/* Modulos Imports*/
import { ModulosComponent } from './modulos/modulos.component';
import { NuevoModuloComponent } from './modulos/nuevo-modulo/nuevo-modulo.component';
import { SingleModuloComponent } from './modulos/single-modulo/single-modulo.component';


/* Empresa  Imports*/
import { EmpresasComponent } from './empresas/empresas.component';
import { NuevaEmpresaComponent } from './empresas/nueva-empresa/nueva-empresa.component';
import { SingleEmpresaComponent } from './empresas/single-empresa/single-empresa.component';

const routes: Routes = [
  {
    path: '', // Ruta principal para el módulo de Seguridad
    component: MenuSeguridadComponent,
  },
  {path: 'oficina',
    component: OficinaComponent,
     } ,
     {
        path: 'oficina/single-oficina/:id',
        component: SingleOficinaComponent,
      },
      {
        path: 'oficina/nueva-oficina',
        component: NuevaOficinaComponent,
      },
      {
        path: 'oficina/asignar-aplicacion-oficina/:id',
        component: AsignarAplicacionOficinaComponent,
      },
  {
    path: 'rol',
    component: RolComponent,
  },
      {
        path: 'rol/single-rol/:id',
        component: SingleRolComponent,
      },
      {
        path: 'rol/nuevo-rol',
        component: NuevoRolComponent,
      },
      {
        path: 'rol/asignar-acceso-rol/:id',
        component: AsignarAccesoRolComponent
      },
  {
    path: 'usuario',
    component: UsuariosComponent,
  },
      {
        path: 'usuario/single-usuario/:id',
        component: SingleUsuarioComponent,
      },
      {
        path: 'usuario/single-usuario/:id/nuevo-documento',
        component: NuevoDocumentoComponent,
      },
      {
        path: 'usuario/nuevo-usuario',
        component: NuevoUsuarioComponent,
      },
  {
    path: 'aplicacion',
    component: AplicacionesComponent,
  },
      {
        path: 'aplicacion/single-aplicacion/:id',
        component: SingleAplicacionComponent,
      },
      {
        path: 'aplicacion/nueva-aplicacion',
        component: NuevaAplicacionComponent,
      },
      {
        path: 'aplicacion/asignar-roles-aplicacion/:id',
        component: AsignarRolesAplicacionComponent,
      },
     
  {
    path: 'acceso',
    component: AccesosComponent,
  },
      {
        path: 'acceso/single-acceso/:id',
        component: SingleAccesoComponent,
      },
      {
        path: 'acceso/nuevo-acceso',
        component: NuevoAccesoComponent,
      },
  {
    path: 'modulo',
    component: ModulosComponent,
  },
      {
        path: 'modulo/single-modulo/:id',
        component: SingleModuloComponent,
      },
      {
        path: 'modulo/nuevo-modulo',
        component: NuevoModuloComponent,
      },
  {
    path: 'empresa',
    component: EmpresasComponent,
  },
      {
        path: 'empresa/single-empresa/:id',
        component: SingleEmpresaComponent,
      },
      {
        path: 'empresa/nueva-empresa',
        component: NuevaEmpresaComponent,
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class SeguridadRoutingModule {}
