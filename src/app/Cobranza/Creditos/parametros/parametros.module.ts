import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrosRoutingModule } from './parametros-routing.module';
import { ParametrosComponent } from './parametros.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MenuParametrosComponent } from './menu-parametros/menu-parametros.component';

/* Parametros Imports*/
import { ParametrosSubComponent } from './parametros-sub/parametros-sub.component';
import { SingleParametroComponent } from './parametros-sub/single-parametro/single-parametro.component';
import { NuevoParametroComponent } from './parametros-sub/nuevo-parametro/nuevo-parametro.component';

/* Grupo de Datos Imports*/
import { GrupoDeDatosComponent } from './grupo-de-datos/grupo-de-datos.component';
import { NuevoGrupoDeDatosComponent } from './grupo-de-datos/nuevo-grupo-de-datos/nuevo-grupo-de-datos.component';
import { SingleGrupoDeDatoComponent } from './grupo-de-datos/single-grupo-de-dato/single-grupo-de-dato.component';
import { NuevoDatoComponent } from './grupo-de-datos/single-grupo-de-dato/nuevo-dato/nuevo-dato.component';
import { SingleDatoComponent } from './grupo-de-datos/single-grupo-de-dato/single-dato/single-dato.component';


@NgModule({
  declarations: [
    ParametrosComponent,
    MenuParametrosComponent,
    ParametrosSubComponent,
    SingleParametroComponent,
    NuevoParametroComponent,
    GrupoDeDatosComponent,
    NuevoGrupoDeDatosComponent,
    SingleGrupoDeDatoComponent,
    NuevoDatoComponent,
    SingleDatoComponent,
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    SharedModule
  ]
})
export class ParametrosModule { }
