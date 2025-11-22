import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndicadoresRoutingModule } from './indicadores-routing.module';
import { IndicadoresComponent } from './indicadores.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MenuIndicadoresComponent } from './menu-indicadores/menu-indicadores.component';
import { ProductividadComponent } from './productividad/productividad.component';
import { IncentivosComponent } from './incentivos/incentivos.component';
import { AsignacionMetasComponent } from './asignacion-metas/asignacion-metas.component';
import { SeguimientoAvancesComponent } from './seguimiento-avances/seguimiento-avances.component';
import { NuevaMetaComponent } from './asignacion-metas/nueva-meta/nueva-meta.component';


@NgModule({
  declarations: [
    IndicadoresComponent,
    MenuIndicadoresComponent ,
    ProductividadComponent,
    IncentivosComponent,
    AsignacionMetasComponent,
    SeguimientoAvancesComponent,
    NuevaMetaComponent
  ],
  imports: [
    CommonModule,
    IndicadoresRoutingModule,
    SharedModule,
  ]
})
export class IndicadoresModule { }