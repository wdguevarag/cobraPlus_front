import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { MantenimientoComponent } from './mantenimiento.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MenuMantenimientoComponent } from './menu-mantenimiento/menu-mantenimiento.component';

/* Clientes Imports */
import { ClientesComponent } from './clientes/clientes.component';
import { SingleClienteComponent } from './clientes/single-cliente/single-cliente.component';
import { NuevoClienteComponent } from './clientes/nuevo-cliente/nuevo-cliente.component';
import { SingleClienteDomicilioComponent } from './clientes/cliente-tabs/domicilio/single-cliente-domicilio/single-cliente-domicilio.component';
import { SingleClienteNuevoDomicilioComponent } from './clientes/cliente-tabs/domicilio/single-cliente-nuevo-domicilio/single-cliente-nuevo-domicilio.component';
import { SimpleClienteComponent } from './clientes/single-simple-cliente/single-simple-cliente.component';

import { SingleClienteNegocioComponent } from './clientes/cliente-tabs/negocio/single-cliente-negocio/single-cliente-negocio.component';
import { SingleClienteNuevoNegocioComponent } from './clientes/cliente-tabs/negocio/single-cliente-nuevo-negocio/single-cliente-nuevo-negocio.component';
import { SingleClienteNuevoContactoComponent } from './clientes/cliente-tabs/contacto/single-cliente-nuevo-contacto/single-cliente-nuevo-contacto.component';
import { SingleClienteContactoComponent } from './clientes/cliente-tabs/contacto/single-cliente-contacto/single-cliente-contacto.component';
import { SingleClienteCuentaComponent } from './clientes/cliente-tabs/cuenta/single-cliente-cuenta/single-cliente-cuenta.component';
import { SingleClienteNuevaCuentaComponent } from './clientes/cliente-tabs/cuenta/single-cliente-nueva-cuenta/single-cliente-nueva-cuenta.component';
import { SingleClienteRccComponent } from './clientes/cliente-tabs/rcc/single-cliente-rcc/single-cliente-rcc.component';
import { SingleClienteNuevoRccComponent } from './clientes/cliente-tabs/rcc/single-cliente-nuevo-rcc/single-cliente-nuevo-rcc.component';
import { SingleClienteDocumentoComponent } from './clientes/cliente-tabs/documento/single-cliente-documento/single-cliente-documento.component';
import { SingleClienteNuevoDocumentoComponent } from './clientes/cliente-tabs/documento/single-cliente-nuevo-documento/single-cliente-nuevo-documento.component';
import { SingleClienteFamiliarComponent } from './clientes/cliente-tabs/familiar/single-cliente-familiar/single-cliente-familiar.component';
import { SingleClienteNuevoFamiliarComponent } from './clientes/cliente-tabs/familiar/single-cliente-nuevo-familiar/single-cliente-nuevo-familiar.component';



/* Asesores Imports */

import { AsesoresComponent } from './asesores/asesores.component';
import { SingleAsesorComponent } from './asesores/single-asesor/single-asesor.component';

import { AsesorTabsComponent } from './asesores/asesor-tabs/asesor-tabs.component';
import { SingleAsesorCuentaComponent } from './asesores/asesor-tabs/cuenta/single-asesor-cuenta/single-asesor-cuenta.component';
import { SingleAsesorNuevaCuentaComponent } from './asesores/asesor-tabs/cuenta/single-asesor-nueva-cuenta/single-asesor-nueva-cuenta.component';
import { SingleAsesorComentarioComponent } from './asesores/asesor-tabs/comentario/single-asesor-comentario/single-asesor-comentario.component';
import { SingleAsesorNuevoComentarioComponent } from './asesores/asesor-tabs/comentario/single-asesor-nuevo-comentario/single-asesor-nuevo-comentario.component';
import { ClienteTabsComponent } from './clientes/cliente-tabs/cliente-tabs.component';
import { SingleClienteNuevaEvaluacionComponent } from './clientes/cliente-tabs/evaluacion/single-cliente-nueva-evaluacion/single-cliente-nueva-evaluacion.component';
import { SingleClienteEvaluacionComponent } from './clientes/cliente-tabs/evaluacion/single-cliente-evaluacion/single-cliente-evaluacion.component';







@NgModule({
  declarations: [
    MantenimientoComponent,
    MenuMantenimientoComponent,
    ClientesComponent,
    SingleClienteComponent,
    NuevoClienteComponent,
    SingleClienteDomicilioComponent,
    SingleClienteNuevoDomicilioComponent,
    SingleClienteNegocioComponent,
    SingleClienteNuevoNegocioComponent,
    SingleClienteContactoComponent,
    SingleClienteNuevoContactoComponent,
    AsesoresComponent,
    SingleAsesorComponent,
    SingleClienteCuentaComponent,
    SingleClienteNuevaCuentaComponent,
    SingleClienteRccComponent,
    SingleClienteNuevoRccComponent,
    SingleClienteDocumentoComponent,
    SingleClienteNuevoDocumentoComponent,
    SingleClienteFamiliarComponent,
    SingleClienteNuevoFamiliarComponent,
    AsesorTabsComponent,
    SingleAsesorCuentaComponent,
    SingleAsesorNuevaCuentaComponent,
    SingleAsesorComentarioComponent,
    SingleAsesorNuevoComentarioComponent,
    ClienteTabsComponent,
    SingleClienteNuevaEvaluacionComponent,
    SingleClienteEvaluacionComponent,
    SimpleClienteComponent
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    SharedModule,
  ],
  exports : [
    ClienteTabsComponent,
    SingleClienteComponent,
    SimpleClienteComponent,
    SingleClienteNuevaEvaluacionComponent,
    SingleClienteEvaluacionComponent,
  ]
})
export class MantenimientoModule { }
