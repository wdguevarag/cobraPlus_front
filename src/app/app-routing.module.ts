import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/admin-layout/admin-layout.component';
import { AuthGuard } from './authguard';  
import { LoginComponent } from './Cobranza/Login/login.component';
import { InicioComponent } from './Cobranza/Inicio/inicio.component';
import { MenuPrincipalComponent } from './Cobranza/Inicio/menu-principal/menu-principal.component';

const routes: Routes = [
 { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: InicioComponent
      },

      {
        path: 'seguridad/seguridad-menu',
        component: MenuPrincipalComponent
      },

      {
        path: 'creditos/credito-menu',
        component: MenuPrincipalComponent
      },
      {
        path: 'seguridad/seguridad',
        loadChildren: () => import('./Cobranza/Seguridad/seguridad/seguridad.module').then(m => m.SeguridadModule),
      },
      {
        path: 'seguridad/empresa',
        loadChildren: () => import('./Cobranza/Seguridad/empresa/empresa.module').then(m => m.EmpresaModule),
      },
      {
        path: 'creditos/parametro',
        loadChildren: () => import('./Cobranza/Creditos/parametros/parametros.module').then(m => m.ParametrosModule),
      },
      {
        path: 'creditos/mantenimiento',
        loadChildren: () => import('./Cobranza/Creditos/mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule),
      },
      {
        path: 'creditos/consulta',
        loadChildren: () => import('./Cobranza/Creditos/consulta/consulta.module').then(m => m.ConsultaModule),
      },
      {
        path: 'creditos/credito',
        loadChildren: () => import('./Cobranza/Creditos/creditos/creditos.module').then(m => m.CreditosModule),
      },
      {
        path: 'creditos/operacion',
        loadChildren: () => import('./Cobranza/Creditos/operaciones/operaciones.module').then(m => m.OperacionesModule),
      },
      {
        path: 'creditos/reporte',
        loadChildren: () => import('./Cobranza/Creditos/reportes/reportes.module').then(m => m.reportesModule),
      },
      {
        path: 'creditos/oficialia',
        loadChildren: () => import('./Cobranza/Creditos/oficialia/oficialia.module').then(m => m.OficialiaModule),
      },
      {
        path: 'creditos/documento',
        loadChildren: () => import('./Cobranza/Creditos/documentos/documentos.module').then(m => m.DocumentosModule),
      },
      {
        path: 'creditos/indicador',
        loadChildren: () => import('./Cobranza/Creditos/indicadores/indicadores.module').then(m => m.IndicadoresModule),
      },

    ],
  },
   { path: '**', redirectTo: 'login' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes , { onSameUrlNavigation: 'reload' } )],
  exports: [RouterModule],
})
export class AppRoutingModule {}